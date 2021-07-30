import { Router } from 'express';
import {
  GetUserInfo,
  GetUserList,
  UpdatePassword,
  GetRandomSuggestFriends,
} from '../controller/User';
import authorizeMiddleware from '../middleware/authorizeMiddleware';
import baseAuth from '../middleware/baseAuth';

const route = Router();

route
  .get('/', baseAuth, GetUserList)
  .patch('/:userID', authorizeMiddleware, UpdatePassword)
  .get('/:userId', authorizeMiddleware, GetUserInfo)
  .get('/friends/random', authorizeMiddleware, GetRandomSuggestFriends);
export default route;
