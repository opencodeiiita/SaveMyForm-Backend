import dotev from 'dotenv';

dotev.config()

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";


export function getJwt(object,expiresIn='30d'){
  const secret = process.env.SECRET; 
  const options = {
    algorithm: 'HS256', // Use HS256 algorithm
    expiresIn: expiresIn
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

export async function encryptString(str){
    const encrypted = await CryptoJS.AES.encrypt(str, process.env.SECRET);
    return encrypted;
}

export async function dcryptString(encryptedStr){
  const decrypted =await CryptoJS.AES.decrypt(encryptedStr, process.env.SECRET);
  return decrypted;
}
