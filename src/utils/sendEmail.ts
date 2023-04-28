import nodemailer from 'nodemailer';

const sendEmail = async () => {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount, 'sendEmail');

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'aaron57@ethereal.email',
      pass: 'e8EHuqWRQZpxr8XzKE',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"lol" <oldestspy@gmail.com>', // sender address
    // from: '"Fred Foo 👻" <ciuchy.com>', // sender address
    to: 'user@user.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  });
  console.log(info, 'sendEmail');
};

export default sendEmail;
