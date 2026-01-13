import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Verify transporter connection
export async function verifyConnection(): Promise<boolean> {
    try {
        await transporter.verify();
        console.log('SMTP connection verified');
        return true;
    } catch (error) {
        console.error('SMTP connection failed:', error);
        return false;
    }
}
