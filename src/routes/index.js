import { Router } from 'express';
import { statusCodes } from '../constants';
import usersRoute from './users';
import tenders from './tenders';

const router = Router();
router.use('/users', usersRoute);
router.use('/tenders', tenders);

router.use((req, res) =>
  res.status(statusCodes.NOT_FOUND).json({
    message: `Invalid url: ${req.url}`,
  })
);

export default router;
