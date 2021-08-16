import { Router } from 'express';
import {
  AcceptFriendRequest,
  DeleteFriendRequest,
  SendFriendRequest,
} from '../controller/Friend';

const router = Router();

router
  .post('/:userId', SendFriendRequest)
  .patch('/:userId', AcceptFriendRequest)
  .delete('/:userId', DeleteFriendRequest);

export default router;
