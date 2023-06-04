import nodemailer from 'nodemailer';

const sendEmail = async () => {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'betsy31@ethereal.email',
      pass: 'PHVZGumCttT2csJYeh',
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <ciuchy.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  });
  console.log(info);
};

export default sendEmail;
