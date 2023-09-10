import { Router } from 'express';
import TenderController from '../controllers/tenders';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';
import joiValidator from '../middleware/joiValidator';
import checkPerm from '../middleware/checkPerm';
import checkIfItemExist from '../middleware/checkIfItemExist';

import {
    createTenderValidator,
    amendTenderValidator,
    approveOrRejectTenderValidator
} from '../validators/Tender';

const router = Router();

router.route('/').get(
    auth,
    asyncHandler(TenderController.getAll)
);

router.route('/procurremnt-requests').get(
    auth,
    checkPerm(['ADMIN']),
    asyncHandler(TenderController.getProcurrementRequests)
);


router.route('/').post(auth,
    checkPerm(['ADMIN', 'PROCUREMENT_OFFICER', 'STAFF_USER']),
    joiValidator(createTenderValidator),
    asyncHandler(TenderController.create));

router.route('/:tenderId').patch(auth,
    checkPerm(['ADMIN', 'PROCUREMENT_OFFICER']),
    checkIfItemExist([
        { modelName: 'Tender', hasIdInBody: false }
    ]),
    joiValidator(amendTenderValidator),
    asyncHandler(TenderController.amendTender));

router.route('/approve-reject/:tenderId').patch(auth,
    checkPerm(['ADMIN']),
    checkIfItemExist([
        { modelName: 'Tender', hasIdInBody: false }
    ]),
    joiValidator(approveOrRejectTenderValidator),
    asyncHandler(TenderController.approveOrRejectTender));
export default router;
