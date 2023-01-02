import {
  response_200,
  response_201,
  response_400,
  response_404,
  response_500,
} from '../utils/responseCodes.js';
import { hash_password, getJwt } from '../utils/password.js';
import User from '../models/user.model.js';
import verifycaptcha from '../utils/recaptcha.js';
import validator from 'validator';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.ENV === 'prod'
    ? 'https://savemyform.tk/signin/oauth'
    : 'http://localhost:3000/signin/oauth',
);

export async function logIn(req, res) {
  const { email, recaptcha_token } = req.body;
  if (!(email && recaptcha_token && req.body.password))
    return response_400(res, 'Some parameters are missing!');
  if (!verifycaptcha(recaptcha_token))
    return response_400(res, 'Captcha was found incorrect!');
  const password = await hash_password(req.body.password);

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) return response_404(res, "User Doesn't exist");
    const checkPassword = password === checkUser.passwordHash;
    if (!checkPassword) return response_400(res, 'Password is incorrect');
    if (checkUser.passwordHash === '')
      return response_400(
        res,
        'Account created using Google Auth, either change your password or Signin with Google',
      );
    const jwtToken = getJwt({ id: checkUser._id, email: email });
    return response_200(res, 'Log In Succesful', {
      name: checkUser.name,
      email: email,
      verified: checkUser.verified,
      secret: jwtToken,
    });
  } catch (error) {
    console.log(error);
  }

  // return response_200(res, 'Hello there!');
}
export function greet(req, res) {
  response_200(res, 'Hello There');
}

export async function signUp(req, res) {
  const { name, email, recaptcha_token } = req.body;
  if (!(name && email && recaptcha_token && req.body.password))
    return response_400(res, 'Some parameters are missing!');
  if (req.body.password.length < 6)
    return response_400(res, 'Password must be longer than 6 letters');
  if (!validator.isEmail(email)) return response_400(res, 'Email is invalid');
  const checkUser = await User.findOne({ email });
  if (checkUser) return response_400(res, 'Email already in use');
  if (!verifycaptcha(recaptcha_token))
    return response_400(res, 'Captcha was found incorrect');
  const password = await hash_password(req.body.password);
  let newUser = User({
    email,
    name,
    passwordHash: password,
    verified: process.env.ENV === 'prod' ? false : true,
  });
  try {
    newUser = await newUser.save();
    const jwtToken = getJwt({ id: newUser._id, email: newUser.email });
    return response_201(res, 'Sign Up Succesful', {
      name,
      email,
      verified: newUser.verified,
      secret: jwtToken,
    });
  } catch (error) {
    return response_500(res, 'Internal server error', error);
  }
}

export async function authGoogle(req, res) {
  const { token } = req.body;
  if (!token) return response_400(res, 'The token is missing!');
  try {
    let idtoken = await client.getToken(token);
    const ticket = await client.verifyIdToken({
      idToken: idtoken.tokens.id_token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();
    const checkUser = await User.exists({ email });
    if (checkUser) {
      const jwtToken = getJwt({ id: checkUser._id, email: email });
      return response_200(res, 'Log In Succesful', {
        name: checkUser.name,
        email: email,
        verified: checkUser.verified,
        secret: jwtToken,
      });
    } else {
      const password = '';
      let newUser = User({
        email,
        name,
        passwordHash: password,
        verified: process.env.ENV === 'prod' ? false : true,
      });
      newUser = await newUser.save();
      const jwtToken = getJwt({ id: newUser._id, email: newUser.email });
      return response_201(res, 'Sign Up Succesful', {
        name,
        email,
        verfied: newUser.verified,
        secret: jwtToken,
      });
    }
  } catch (error) {
    return response_500(res, 'Internal server error', error);
  }
}

export async function getGoogleAuthUrl(req, res) {
  const url = client.generateAuthUrl({
    access_type: 'online',
    scope: ['profile', 'email'],
  });
  return response_200(res, 'Success', { url });
}
