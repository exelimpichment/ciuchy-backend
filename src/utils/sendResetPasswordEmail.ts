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

  const msg = `
<div style="
  background-image: url(https://res.cloudinary.com/dqwqb94ps/image/upload/v1683425133/heroImage_vbdmlw.jpg);
  width: 100%; 
  height: 500px; 
  background-repeat: no-repeat; 
  background-size: cover">
  <div style="margin: 0 auto; width: 500px; padding-top: 145px; color: white; text-align: center">
    <h1 style="font-family:verdana; font-size: 2rem; max-width: 500px">Hey ${name}!</h1>
     <a href="${resetUrl}" style="
      font-size: 1.5rem;
      cursor: pointer;
      color: white;
      font-weight: 500;
      text-decoration: none;
      background-color: black;
      padding: 10px 10px;
      border-radius: 7px;" 
    >Reset Password</a>
  </div>
</div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: msg,
  });
};

export default sendResetPasswordEmail;
