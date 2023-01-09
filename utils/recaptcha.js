export default async function verifycaptcha(token) {
  if (process.env.ENV === 'dev') return true;
  var secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  var userKey = token;
  let res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: {
      secret: secretKey,
      response: userKey,
    },
  });

  if (res.body.success) {
    return true;
  }

  return false;
}
