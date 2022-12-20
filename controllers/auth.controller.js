import { response_200, response_400, response_404 } from '../utils/responseCodes.js';
import { hash_password , getJwt} from '../utils/password.js'
import User from '../models/user.model.js';
import verifycaptcha from '../utils/recaptcha.js';

export async function logIn(req, res) {
  const {email, recaptcha_token} = req.body;
  if(!verifycaptcha(recaptcha_token)) return response_400(res, "Captcha was found incorrect!");
  const password = await hash_password(req.body.password);
  
  try {
    const checkUser = await User.findOne({email})
    if(!checkUser) return response_404(res, "User Doesn't exist")
    const checkPassword = password === checkUser.passwordHash;
    if(!checkPassword) return response_400(res,"Password is incorrect");
    const jwtToken = getJwt({id : checkUser._id , email : email})
    return response_200(res, "Log In Succesful" , {name : checkUser.name , email : email , verfied : checkUser.verfied , secret : jwtToken});
  } catch (error) {
    console.log(error);
  }

  // return response_200(res, 'Hello there!');
}
export function greet(req,res){
  response_200(res, "Hello There")
}
