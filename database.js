const { Pool } = require('pg');
require('dotenv').config();

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please ensure you have:');
    console.error('1. Added a PostgreSQL database to your Railway project');
    console.error('2. The DATABASE_URL variable is automatically set by Railway');
    process.exit(1);
}

console.log('DATABASE_URL found, connecting to PostgreSQL...');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Helper function to execute queries
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Helper function to get a client from the pool
async function getClient() {
    return await pool.connect();
}

module.exports = {
    query,
    getClient,
    pool
};
