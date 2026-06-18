const env = require('../config/env');

async function sendVerificationEmail(toEmail, otpCode) {
    if (env.NODE_ENV === 'test') return;
    if (!env.BREVO_API_KEY) {
        console.warn('⚠️ BREVO_API_KEY not set. Email delivery is disabled. (Check Render environment variables)');
        console.log(`\n📧 MOCK EMAIL TO: ${toEmail}\n🔒 OTP CODE: ${otpCode}\n`);
        return;
    }

    const payload = {
        sender: {
            name: "Digital Twin",
            email: "kumarkartikey020@gmail.com" // Must match verified Brevo sender exactly
        },
        to: [{ email: toEmail }],
        subject: 'Verify your Digital Twin Account',
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #2a7de1; text-align: center;">Welcome to Digital Twin!</h2>
            <p style="font-size: 16px; color: #333;">Please use the verification code below to activate your account and verify your email address.</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 25px 0;">
                <strong style="font-size: 32px; letter-spacing: 5px; color: #000;">${otpCode}</strong>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin. All rights reserved.</p>
        </div>
        `
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
            const errorText = await response.text();
            console.error('Brevo API Error:', response.status, errorText);
            throw new Error(`Email delivery failed: ${response.status}`);
        }
        
        console.log(`Email OTP sent successfully to ${toEmail} via Brevo`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
}

async function sendPasswordResetEmail(toEmail, otpCode) {
    if (env.NODE_ENV === 'test') return;
    if (!env.BREVO_API_KEY) {
        console.warn('⚠️ BREVO_API_KEY not set.');
        console.log(`\n📧 MOCK RESET EMAIL TO: ${toEmail}\n🔒 OTP CODE: ${otpCode}\n`);
        return;
    }

    const payload = {
        sender: {
            name: "Digital Twin",
            email: "kumarkartikey020@gmail.com"
        },
        to: [{ email: toEmail }],
        subject: 'Reset your Digital Twin Password',
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #e12a2a; text-align: center;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the code below to reset it.</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 25px 0;">
                <strong style="font-size: 32px; letter-spacing: 5px; color: #000;">${otpCode}</strong>
            </div>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Digital Twin. All rights reserved.</p>
        </div>
        `
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
            throw new Error(`Email delivery failed: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending reset email:', error);
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
