import nodemailer from 'nodemailer';
import nodeMailerConfig from './nodeMailerConfig';

interface ISendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: ISendEmailProps) => {
  await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: 'store.ciuchy@gmail.com',
    to,
    subject,
    html,
  });
};

export default sendEmail;
