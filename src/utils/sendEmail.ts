import nodemailer from 'nodemailer';
import nodeMailerConfig from './nodeMailerConfig';

interface ISendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: ISendEmailProps) => {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount, 'log');

  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: '<ciuchy.store@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

export default sendEmail;
