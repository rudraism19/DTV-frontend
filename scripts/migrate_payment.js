const db = require('../src/db');

async function run() {
    try {
        console.log('Altering users...');
        await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + interval '5 days')");
        await db.query("ALTER TABLE users ALTER COLUMN trial_expires_at SET DEFAULT (CURRENT_TIMESTAMP + interval '5 days')");
        await db.query("UPDATE users SET trial_expires_at = (created_at + interval '5 days') WHERE trial_expires_at IS NOT NULL AND trial_expires_at <= (created_at + interval '48 hours')");
        await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE");
        
        console.log('Creating orders table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                razorpay_order_id VARCHAR(255) UNIQUE,
                razorpay_payment_id VARCHAR(255),
                razorpay_signature VARCHAR(255),
                plan_duration VARCHAR(50),
                amount INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'created',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Adding new columns for payment proof verification...');
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(255);");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_file_path TEXT;");
        await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);");
        console.log('Migration OK');
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
