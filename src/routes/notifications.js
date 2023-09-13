import { Router } from 'express';
import NotificationController from '../controllers/notification';
import auth from '../middleware/checkAuth';
import asyncHandler from '../middleware/errorHandler';


const router = Router();

router.route('/').get(
    auth,
    asyncHandler(NotificationController.getAll)
);

export default router;

