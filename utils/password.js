import dotev from 'dotenv';

dotev.config()

import crypto from 'crypto';
import jwt from 'jsonwebtoken';


export function getJwt(object){
  const secret = process.env.SECRET; 
  const options = {
    algorithm: 'HS256', // Use HS256 algorithm
    expiresIn: '30d' // Token expires in one hour
  };

  // Sign the JWT with the payload, secret key, and options
  const token = jwt.sign({ payload: object }, secret, options);

  return token;
}

export async function hash_password(password){
    var salt = process.env.SECRET;
    var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return genHash;
}
