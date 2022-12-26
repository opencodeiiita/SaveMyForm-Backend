import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

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

export function sendVerificationLink(email, secret, ip) {
  let link = 'http://savemyform.tk/verify/' + secret;
  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('../templates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('../templates/'),
};
  transporter.use('compile',hbs(handlebarOptions))
  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: 'Email verification link',
    template: 'verification',
    context:{
        url:link,
        ip: ip
    }
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
