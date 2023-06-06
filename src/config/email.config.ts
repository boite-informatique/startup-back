import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    auth: {
        user: process.env.SMTP_USER || 'dalton.luettgen@ethereal.email',
        pass: process.env.SMTP_PASS || 'Ny5RMWjsf4PaS8Dw2h',
    },
}));
