import bcrypt from 'bcryptjs';
import dotev from 'dotenv';

dotev.config()

const jwt = require('jsonwebtoken');

export function getJwt(object){
  const secret = process.env.SECRET; 
  const options = {
    algorithm: 'HS256', // Use HS256 algorithm
    expiresIn: '1h' // Token expires in one hour
  };

  // Sign the JWT with the payload, secret key, and options
  const token = jwt.sign({ payload: object }, secret, options);

  return token;
}

export function hash_password(password){
     const hasPassword=bcrypt.hash(password,process.env.SECRET);
    return  hasPassword;
}
