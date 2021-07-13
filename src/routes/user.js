import { Router } from 'express';
import { GetUserList, UpdatePassword } from '../controller/User';
import authorizeMiddleware from '../middleware/authorizeMiddleware';
import baseAuth from '../middleware/baseAuth';

const route = Router();

route
  .get('/', baseAuth, GetUserList)
  .patch('/:userID', authorizeMiddleware, UpdatePassword);

export default route;
