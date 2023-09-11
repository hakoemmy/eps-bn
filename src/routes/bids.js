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

router.route('/tenders/:tenderId/get-suggested-winners').get(auth,
        checkPerm(['ADMIN', 'PROCUREMENT_OFFICER']),
        checkIfItemExist([
            { modelName: 'Tender', hasIdInBody: false }
        ]),
        asyncHandler(BidController.getSuggestedWinners));

router.route('/:bidId/select-winner').patch(auth,
            checkPerm(['ADMIN', 'PROCUREMENT_OFFICER']),
            checkIfItemExist([
                { modelName: 'Bid', hasIdInBody: false }
            ]),
            asyncHandler(BidController.selectWinner));

export default router;