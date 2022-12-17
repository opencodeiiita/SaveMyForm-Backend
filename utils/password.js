import bcrypt from 'bcryptjs';

const hash_password=async(req,res)=>{
    const {password}=req.body;
    const hasPassword=await bcrypt.hash(password,12);
    req.body.password=hasPassword;
}
export default hash_password;