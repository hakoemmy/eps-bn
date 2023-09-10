import { Router } from 'express';
import { statusCodes } from '../constants';
import usersRoute from './users';
import tenders from './tenders';
import bids from './bids';
import ratings from './ratings';

const router = Router();
router.use('/users', usersRoute);
router.use('/tenders', tenders);
router.use('/bids', bids);
router.use('/ratings', ratings);

router.use((req, res) =>
  res.status(statusCodes.NOT_FOUND).json({
    message: `Invalid url: ${req.url}`,
  })
);

export default router;
