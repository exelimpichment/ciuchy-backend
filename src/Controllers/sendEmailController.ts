import { Response, Request } from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = async (req: Request, res: Response) => {
  await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'jasmin.denesik60@ethereal.email',
      pass: 'HN58etz8FkywaadB4a',
    },
  });
  await transporter.sendMail({
    from: '"ciuchy.com👗👔" <oldestspy@gmail.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    html: '<b>Hello world</b>', // html body
    //       text: 'Hello world?', // plain text body
  });
};
