const sgMail = require('@sendgrid/mail');

const mailSender = (() => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const from = 'daotoansp803@gmail.com';

  const sendOTPCode = (to, code) => {
    const msg = {
      to,
      from,
      subject: '',
      text: '',
      html: `
      <h1>VNSPORT, verify code.</h1>
      <p style="color:red"><strong>This is your otp code, do not share it to any one !</strong></p>
      <h2>${code}</h2>
      `,
    };
    return sgMail.send(msg);
  };

  return { sendOTPCode };
})();

export default mailSender;
