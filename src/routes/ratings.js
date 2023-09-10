import { Router } from 'express';
import RatingController from '../controllers/ratings';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';
import joiValidator from '../middleware/joiValidator';
import checkPerm from '../middleware/checkPerm';
import checkIfItemExist from '../middleware/checkIfItemExist';

import {
    createRatingValidator
} from '../validators/Rating';

const router = Router();

router.route('/').post(auth,
    checkPerm(['STAFF_USER']),
    checkIfItemExist([
        { modelName: 'Bid', hasIdInBody: true },
        { modelName: 'User', hasIdInBody: true, customId: 'vendorId' }
    ]),
    joiValidator(createRatingValidator),
    asyncHandler(RatingController.create));


export default router;