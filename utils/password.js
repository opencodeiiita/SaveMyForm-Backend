import bcrypt from 'bcryptjs';
import dotev from 'dotenv';

dotev.config()

const hash_password=(password)=>{
     const hasPassword=bcrypt.hash(password,process.env.SALT_KEY);
    return  password=hasPassword;
}
export default hash_password;