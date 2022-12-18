import bcrypt from 'bcryptjs';
import dotev from 'dotenv';

dotev.config()

export function getJwt(object){}

export function hash_password(password){
     const hasPassword=bcrypt.hash(password,process.env.SECRET);
    return  hasPassword;
}
