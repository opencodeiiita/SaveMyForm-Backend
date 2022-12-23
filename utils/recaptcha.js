import recaptchaVerify from recaptcha-verify 
import { response_400 } from './responseCodes.js'

export default function verifycaptcha(token){
    if(process.env.ENV === 'dev') return true;

    var recaptcha = new recaptchaVerify({
        secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        verbose: true
      });
    
    recaptcha.checkResponse(token, function(error, response){
        if(error){
            console.log(err);
            return false;
        }
        if(response.success){
            return true
        }else{
            return false
        }
    });
}
