import passport from 'passport';
import { errorMessages, statusCodes } from '../constants';
import async from './errorHandler';
import models from '../models';
import { sendResult } from '../helpers';

const {User} = models;

export default async((req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const error = new Error(errorMessages.UNAUTHORIZED);
    error.status = statusCodes.UNAUTHORIZED;
    if (err || !user) throw error;
    else {
      req.user = user;
      next();
    }
  })(req, res, next)
);
