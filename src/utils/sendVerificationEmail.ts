import sendEmail from './sendEmail';

interface ISendVerificationEmailProps {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}: ISendVerificationEmailProps) => {
  console.log(name, email, { verificationToken }, origin);

  const verifyEmail = `${origin}/user/verify-email?verificationToken=${verificationToken}&email=${email}`;

  const message = `<p>Verification link: <a href="${verifyEmail}">Verify Email</ a></p>`;

  return sendEmail({
    to: email,
    subject: 'EmailConfirmation',
    html: message,
  });
};

export default sendVerificationEmail;
