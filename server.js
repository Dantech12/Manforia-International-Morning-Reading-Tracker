const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const { query, pool } = require('./database');
const { initializeDatabase } = require('./init-db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'manforia-reading-tracker-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize database on startup
async function startServer() {
    try {
        await initializeDatabase();
        console.log('Database initialized successfully');
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

// Helper function to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Helper function to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.session.userId && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
};

// Helper function to get current week information
const getCurrentWeekInfo = () => {
    const now = new Date();
    const weekOfMonth = Math.ceil(now.getDate() / 7);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return {
        weekNumber: weekOfMonth,
        monthYear: `${monthNames[now.getMonth()]} ${now.getFullYear()}`
    };
};

// Routes
app.get('/', (req, res) => {
    if (req.session.userId) {
        if (req.session.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/teacher');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await query('SELECT * FROM teachers WHERE username = $1', [username]);
        const user = result.rows[0];
        
        if (user && await bcrypt.compare(password, user.password_hash)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.fullName = user.full_name;
            req.session.assignedClass = user.assigned_class;
            
            // Check if admin (admin has assigned_class = 'Admin')
            const isAdmin = user.assigned_class === 'Admin';
            req.session.role = isAdmin ? 'admin' : 'teacher';
            
            if (isAdmin) {
                res.json({ success: true, redirect: '/admin' });
            } else {
                res.json({ success: true, redirect: '/teacher' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Admin routes
app.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/admin/teachers', requireAdmin, async (req, res) => {
    try {
        const result = await query('SELECT id, username, full_name, assigned_class, created_at FROM teachers WHERE assigned_class != $1', ['Admin']);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/admin/teachers', requireAdmin, async (req, res) => {
    const { username, password, fullName, assignedClass } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO teachers (username, password_hash, full_name, assigned_class) VALUES ($1, $2, $3, $4) RETURNING id',
            [username, hashedPassword, fullName, assignedClass]
        );
        res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error creating teacher:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create teacher' });
        }
    }
});

app.put('/api/admin/teachers/:id', requireAdmin, async (req, res) => {
    const teacherId = req.params.id;
    const { username, password, fullName, assignedClass } = req.body;
    
    try {
        let queryText = 'UPDATE teachers SET username = $1, full_name = $2, assigned_class = $3';
        let params = [username, fullName, assignedClass];
        
        // Only update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            queryText += ', password_hash = $4 WHERE id = $5 AND assigned_class != $6';
            params.push(hashedPassword, teacherId, 'Admin');
        } else {
            queryText += ' WHERE id = $4 AND assigned_class != $5';
            params.push(teacherId, 'Admin');
        }
        
        const result = await query(queryText, params);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating teacher:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Failed to update teacher' });
        }
    }
});

app.delete('/api/admin/teachers/:id', requireAdmin, async (req, res) => {
    const teacherId = req.params.id;
    
    try {
        const result = await query('DELETE FROM teachers WHERE id = $1 AND assigned_class != $2', [teacherId, 'Admin']);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ error: 'Failed to delete teacher' });
    }
});

// Get all daily reports for admin
app.get('/api/admin/reports/daily', requireAdmin, async (req, res) => {
    try {
        const result = await query(`
            SELECT dr.*, t.full_name as teacher_name, t.assigned_class as class_name 
            FROM daily_reports dr 
            JOIN teachers t ON dr.teacher_id = t.id 
            ORDER BY dr.report_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching daily reports:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all weekly reports for admin
app.get('/api/admin/reports/weekly', requireAdmin, async (req, res) => {
    try {
        const result = await query(`
            SELECT wr.*, t.full_name as teacher_name, t.assigned_class as class_name 
            FROM weekly_reports wr 
            JOIN teachers t ON wr.teacher_id = t.id 
            ORDER BY wr.submitted_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching weekly reports:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Teacher routes
app.get('/teacher', requireAuth, (req, res) => {
    if (req.session.role === 'admin') {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

// Get teacher profile
app.get('/api/teacher/profile', requireAuth, async (req, res) => {
    try {
        const result = await query('SELECT full_name, username, assigned_class FROM teachers WHERE id = $1', [req.session.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Submit daily report
app.post('/api/teacher/daily-report', requireAuth, async (req, res) => {
    const { reportDate, materialsUsed, newWords, comments } = req.body;
    const weekInfo = getCurrentWeekInfo();
    
    try {
        const result = await query(`
            INSERT INTO daily_reports (teacher_id, report_date, materials_used, new_words, comments, week_number, month_year) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (teacher_id, report_date) 
            DO UPDATE SET materials_used = $3, new_words = $4, comments = $5, week_number = $6, month_year = $7
            RETURNING id
        `, [req.session.userId, reportDate, materialsUsed, newWords, comments, weekInfo.weekNumber, weekInfo.monthYear]);
        
        res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error submitting daily report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// Submit weekly report
app.post('/api/teacher/weekly-report', requireAuth, async (req, res) => {
    const { weekNumber, monthYear, activeReaders, studentsNeedingSupport, commonChallenges, strategiesNextWeek } = req.body;
    
    try {
        const result = await query(`
            INSERT INTO weekly_reports (teacher_id, week_number, month_year, active_readers, students_needing_support, common_challenges, strategies_next_week) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (teacher_id, week_number, month_year) 
            DO UPDATE SET active_readers = $4, students_needing_support = $5, common_challenges = $6, strategies_next_week = $7
            RETURNING id
        `, [req.session.userId, weekNumber, monthYear, activeReaders, studentsNeedingSupport, commonChallenges, strategiesNextWeek]);
        
        res.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Error submitting weekly report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// Get teacher's daily reports
app.get('/api/teacher/daily-reports', requireAuth, async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM daily_reports 
            WHERE teacher_id = $1 
            ORDER BY report_date DESC 
            LIMIT 20
        `, [req.session.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teacher daily reports:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get teacher's weekly reports
app.get('/api/teacher/weekly-reports', requireAuth, async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM weekly_reports 
            WHERE teacher_id = $1 
            ORDER BY submitted_at DESC 
            LIMIT 10
        `, [req.session.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teacher weekly reports:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});

// Initialize database and start server
async function initializeAndStart() {
    try {
        // Try to initialize database if not already done
        const { initializeDatabase } = require('./init-db');
        await initializeDatabase();
        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.log('Database may already be initialized or will be initialized later:', error.message);
    }
    
    // Start the server
    startServer();
}

// Start the application
initializeAndStart();

