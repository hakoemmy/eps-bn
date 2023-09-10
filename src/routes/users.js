import { Router } from 'express';
import UserController from '../controllers/users';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';
import joiValidator from '../middleware/joiValidator';
import checkPhoneAndEmail from '../middleware/checkPhoneAndEmail';

import {
  loginUserValidator,
  createUserValidator
}
  from '../validators/User';

const router = Router();
router.post('/login', joiValidator(loginUserValidator), asyncHandler(UserController.login));
router.post('/vendor-registeration', joiValidator(createUserValidator), checkPhoneAndEmail, asyncHandler(UserController.create));
router.route('/user-profile').get(auth, asyncHandler(UserController.getProfile));
export default router;
