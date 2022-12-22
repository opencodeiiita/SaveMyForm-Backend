import recaptchaVerify from recaptcha-verify 
import { response_400 } from './responseCodes.js'

export default function verifycaptcha(token){
    var recaptcha = new recaptchaVerify({
        secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        verbose: true
      });
    
    recaptcha.checkResponse(token, function(error, response){
        if(error){
            response_400(res, error.toString)
            return;
        }
        if(response.success){
            return true
        }else{
            return false
        }
    });
}
