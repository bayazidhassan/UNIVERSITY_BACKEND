import nodemailer from 'nodemailer';
import config from '../config';
export const sendToEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: config.app_email,
      pass: config.app_password,
    },
  });

  await transporter.sendMail({
    from: config.app_email,
    to,
    subject: 'Reset your password within 10 minutes.',
    text: '',
    html,
  });
};
