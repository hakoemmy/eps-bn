import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  JWT_KEY,
} from '../constants';

const { fromAuthHeaderAsBearerToken: jwtFromRequest } = ExtractJwt;

export default (passport) => {
  passport.use(
    new Strategy(
      { jwtFromRequest: jwtFromRequest(), secretOrKey: JWT_KEY },
      (payload, done) => done(null, payload)
    )
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};
