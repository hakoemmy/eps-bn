import { Router } from 'express';
import BidController from '../controllers/bids';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';
import joiValidator from '../middleware/joiValidator';
import checkPerm from '../middleware/checkPerm';
import checkIfItemExist from '../middleware/checkIfItemExist';

import {
    createBidValidator
} from '../validators/Bid';

const router = Router();

router.route('/').get(
    auth,
    checkPerm(['ADMIN', 'PROCUREMENT_OFFICER','VENDOR']),
    asyncHandler(BidController.getAll)
);

router.route('/').post(auth,
    checkPerm(['VENDOR']),
    checkIfItemExist([
        { modelName: 'Tender', hasIdInBody: true }
    ]),
    joiValidator(createBidValidator),
    asyncHandler(BidController.create));


export default router;