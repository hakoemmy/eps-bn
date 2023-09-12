import { Router } from 'express';
import ReportController from '../controllers/reports';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';
import checkPerm from '../middleware/checkPerm';

const router = Router();

router.route('/user-stats').get(auth,
    checkPerm(['ADMIN']),
    asyncHandler(ReportController.getUserStats));

router.route('/tender-stats').get(auth,
        checkPerm(['ADMIN']),
        asyncHandler(ReportController.getTenderStats));
    
router.route('/bid-stats').get(auth,
            checkPerm(['ADMIN']),
            asyncHandler(ReportController.getBidStats));
        
export default router;