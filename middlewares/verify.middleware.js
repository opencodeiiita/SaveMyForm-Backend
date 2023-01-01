import jwt from 'jsonwebtoken';

import {
  response_401,
  response_400,
  response_500,
} from '../utils/responseCodes.js';
import User from '../models/user.model.js';

<<<<<<< HEAD
const verifyMiddleware = async (req, res, next) => {
=======
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !/(Bearer )\w+/.test(authHeader)) {
      // authorization header is not present or is not of the required format
      return response_400(res, 'Request is invalid');
    }

    // extracting the token and verifying it
    const authToken = authHeader.replace('Bearer ', '');

    let userMongoId;

>>>>>>> 219dc7e4f8c80ef1ce97ddba1608ea89f76e84c7
    try {
      const { payload } = jwt.verify(authToken, process.env.SECRET); // will throw err is token is invalid or expired
      req.isAuthenticated = true;
      userMongoId = payload.id;
    } catch (err) {
      // token is invalid or expired
      return response_401(res, 'Request is unauthorized');
    }

    // extracting user info from DB
    const user = await User.findById(userMongoId);

<<<<<<< HEAD
export default verifyMiddleware;
=======
    if (!user || !user.verified) {
      // user is not present in DB
      return response_401(res, 'Request is unauthorized');
    }

    req.user = user;
    next();
  } catch (err) {
    return response_500(res, 'Internal Server Error', err);
  }
};

export default authMiddleware;
>>>>>>> 219dc7e4f8c80ef1ce97ddba1608ea89f76e84c7
