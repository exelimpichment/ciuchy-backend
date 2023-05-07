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
  const verifyEmail = `${origin}/user/verify-email/${verificationToken}?email=${email}`;

  const msg = `
<div style="
  background-image: url(https://res.cloudinary.com/dqwqb94ps/image/upload/v1683425133/heroImage_vbdmlw.jpg);     
  width: 100%; 
  height: 400px; 
  background-repeat: no-repeat; 
  background-size: cover">
  <div style="margin: 0 auto; width: 500px; padding-top: 175px; color: white; text-align: center">
     <a href="${verifyEmail}" style="
      font-size: 1.5rem;
      cursor: pointer;
      color: white;
      font-weight: 500;
      text-decoration: none;
      background-color: black;
      padding: 10px 10px;
      border-radius: 7px;" 
    >Verify email</a>
  </div>
</div>
  `;

  return sendEmail({
    to: email,
    subject: 'EmailConfirmation',
    html: msg,
  });
};

export default sendVerificationEmail;
