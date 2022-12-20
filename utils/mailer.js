import nodemailer from 'nodemailer'

export default function mailer(email, body, html) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }
  });
  
  let mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: 'Sending Email using Node.js', // Sending Subject text as argument would be better
    text: body,
    html: html
  };
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}