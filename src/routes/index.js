import { Router } from 'express';
import { statusCodes } from '../constants';
import usersRoute from './users';

const router = Router();
router.use('/users', usersRoute);

router.use((req, res) =>
  res.status(statusCodes.NOT_FOUND).json({
    message: `Invalid url: ${req.url}`,
  })
);

export default router;
