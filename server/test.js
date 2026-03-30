// test-email.js
const nodemailer = require('nodemailer');

(async () => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'recipient@example.com',
        subject: 'Ethereal test from ParkEase',
        text: 'This is a test email sent to Ethereal'
    });

    console.log('MessageId:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
})();
