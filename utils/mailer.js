import nodemailer from 'nodemailer'

export function mailer(subject, email, body, html) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: subject,
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