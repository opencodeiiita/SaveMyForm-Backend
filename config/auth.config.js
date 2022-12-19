import passport from 'passport';
import LocalStrategy from 'passport-local';
import { OAuth2Client } from 'google-auth-library';
import { Strategy as JWTStrategy } from 'passport-jwt';

// Strategy function for local signin authentication
// paasport.use('user-signin-local',);

// Strategy function for local signup authentication
// paasport.use('user-signup-local',);

// Strategy function for Google OAuth2.0 authentication
// paasport.use('google-auth',);

// Strategy function to verify JWT token recieved in request
// passport.use('jwt',);

export default passport;
