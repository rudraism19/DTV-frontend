const cron = require('node-cron');
const { Parser } = require('json2csv');
const userModel = require('../models/userModel');
const env = require('../config/env');

async function sendBackupEmail(csvString) {
    if (!env.BREVO_API_KEY) {
        console.warn('⚠️ BREVO_API_KEY not set. Backup email skipped.');
        return;
    }

    const payload = {
        sender: {
            name: "Digital Twin Automations",
            email: "kumarkartikey020@gmail.com"
        },
        to: [{ email: "kumarkartikey020@gmail.com" }],
        subject: `Weekly Database Backup - ${new Date().toISOString().split('T')[0]}`,
        htmlContent: `<p>Attached is the weekly database backup of all users.</p>`,
        attachment: [
            {
                content: Buffer.from(csvString).toString('base64'),
                name: `users_backup_${new Date().toISOString().split('T')[0]}.csv`
            }
        ]
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Backup Email failed:', response.status);
        } else {
            console.log('✅ Weekly backup sent successfully.');
        }
    } catch (err) {
        console.error('Error sending backup email:', err);
    }
}

function startBackupCron() {
    // Run every Sunday at 00:00 (midnight)
    cron.schedule('0 0 * * 0', async () => {
        console.log('🔄 Running scheduled weekly database backup...');
        try {
            const data = await userModel.listUsers({ limit: 100000, offset: 0 }); // Fetch all users up to a reasonable limit
            if (data.users.length === 0) return;

            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(data.users);
            
            await sendBackupEmail(csv);
        } catch (error) {
            console.error('❌ Failed to run weekly backup:', error);
        }
    });

    console.log('🕒 Automated Weekly Backup Cron initialized.');
}

module.exports = {
    startBackupCron
};
