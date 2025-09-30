const { query } = require('./database');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function initializeDatabase() {
    try {
        console.log('Initializing PostgreSQL database...');

        // Create teachers table
        await query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                assigned_class VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create daily_reports table
        await query(`
            CREATE TABLE IF NOT EXISTS daily_reports (
                id SERIAL PRIMARY KEY,
                teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
                report_date DATE NOT NULL,
                materials_used TEXT NOT NULL,
                new_words TEXT,
                comments TEXT,
                week_number INTEGER NOT NULL,
                month_year VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, report_date)
            )
        `);

        // Create weekly_reports table
        await query(`
            CREATE TABLE IF NOT EXISTS weekly_reports (
                id SERIAL PRIMARY KEY,
                teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
                week_number INTEGER NOT NULL,
                month_year VARCHAR(20) NOT NULL,
                active_readers TEXT NOT NULL,
                students_needing_support TEXT NOT NULL,
                common_challenges TEXT NOT NULL,
                strategies_next_week TEXT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, week_number, month_year)
            )
        `);

        // Create admin user if it doesn't exist
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        console.log(`Creating admin user with username: ${adminUsername}`);
        console.log(`Admin password set: ${adminPassword ? 'Yes' : 'No'}`);
        
        const existingAdmin = await query(
            'SELECT id, username, assigned_class FROM teachers WHERE username = $1',
            [adminUsername]
        );

        if (existingAdmin.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await query(
                `INSERT INTO teachers (full_name, username, password_hash, assigned_class) 
                 VALUES ($1, $2, $3, $4)`,
                ['Administrator', adminUsername, hashedPassword, 'Admin']
            );
            console.log(`✅ Admin user created successfully with username: ${adminUsername}`);
        } else {
            console.log(`⚠️ Admin user already exists: ${JSON.stringify(existingAdmin.rows[0])}`);
            
            // Update existing admin user with new password if environment variables changed
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await query(
                `UPDATE teachers SET password_hash = $1, assigned_class = $2 WHERE username = $3`,
                [hashedPassword, 'Admin', adminUsername]
            );
            console.log(`✅ Admin user password updated for username: ${adminUsername}`);
        }

        // Create indexes for better performance
        await query(`
            CREATE INDEX IF NOT EXISTS idx_daily_reports_teacher_date 
            ON daily_reports(teacher_id, report_date)
        `);

        await query(`
            CREATE INDEX IF NOT EXISTS idx_weekly_reports_teacher_week 
            ON weekly_reports(teacher_id, week_number, month_year)
        `);

        await query(`
            CREATE INDEX IF NOT EXISTS idx_teachers_username 
            ON teachers(username)
        `);

        console.log('Database initialization completed successfully!');
        
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('Database setup complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database setup failed:', error);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
