import { registerAs } from '@nestjs/config';

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
};
export default registerAs('email', () => ({
    ...smtpConfig,
    transport: `smtp://${smtpConfig.user}:${smtpConfig.password}@${smtpConfig.host}/?pool=true`,
}));
