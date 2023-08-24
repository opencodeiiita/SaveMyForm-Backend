import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

const BASE_URL =
  process.env.ENV === 'prod'
    ? 'https://www.savemyform.in.net'
    : 'http://localhost:3000';

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
  console.log(secret);
  let link = BASE_URL + '/verify/' + secret;
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('templates/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('templates/'),
  };
  transporter.use('compile', hbs(handlebarOptions));
  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: 'Email verification link',
    template: 'verification',
    context: {
      url: link,
      ip: ip,
    },
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export function sendCollabInvitationLink(email, secret, projectName) {
  let link = BASE_URL + '/collab/' + secret;
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('templates/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('templates/'),
  };
  transporter.use('compile', hbs(handlebarOptions));
  var mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: 'Collaboration invitation link',
    template: 'collaborator',
    context: {
      url: link,
      projectName,
      userEmail: email,
    },
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
