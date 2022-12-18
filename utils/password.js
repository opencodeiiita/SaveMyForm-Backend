import bcrypt from 'bcryptjs';
import dotev from 'dotenv';

dotev.config()

function base64UrlEncode(str) {
  // Encode the string as base64
  const base64 = btoa(str);

  // Replace characters that are not URL-safe with their URL-safe counterparts
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


export function getJwt(object){
  // Set the algorithm for signing the JWT
  const algorithm = 'HS256';

  // Set the JWT header
  const header = {
    alg: algorithm,
    typ: 'JWT'
  };

  // Encode the header and payload as base64 strings
  const base64Header = base64UrlEncode(JSON.stringify(header));
  const base64Payload = base64UrlEncode(JSON.stringify(object));

  // Create the signature
  const signature = process.env.SECRET;

  // Return the JWT
  return `${base64Header}.${base64Payload}.${signature}`;
}

export function hash_password(password){
     const hasPassword=bcrypt.hash(password,process.env.SECRET);
    return  hasPassword;
}
