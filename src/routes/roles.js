import express from 'express';
import RoleController from '../controllers/role';
import auth from '../middleware/checkAuth';
import checkPerm from '../middleware/checkPerm';
import asyncHandler from '../middleware/errorHandler';

const app = express.Router();

app.get('/', auth, 
 checkPerm(['ADMIN', 'SUPER_ADMIN','COMPANY_ADMIN']), 
 asyncHandler(RoleController.get));



export default app;
