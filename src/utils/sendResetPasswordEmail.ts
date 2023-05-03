import sendEmail from './sendEmail';

interface ISendResetPasswordEmailProps {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}

const sendResetPasswordEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}: ISendResetPasswordEmailProps) => {
  const resetUrl = `${origin}/user/reset-password/${verificationToken}?email=${email}`;

  const message = `<p>You may reset password here: <a href="${resetUrl}">Reset Password</ a></p>`;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<>Hello, ${name}</>
  ${message}
  `,
  });
};

export default sendResetPasswordEmail;
