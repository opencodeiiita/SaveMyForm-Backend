import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

export function mailer(subject, email, body, html) {
  let mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: subject,
    text: body,
    html: html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export function sendVerificationLink(email, secret) {
  let link = 'http://savemyform.tk/verify/' + secret;
}
