import { Router } from 'express';
import { AcceptFriendRequest, SendFriendRequest } from '../controller/Friend';

const router = Router();

router
  .post('/:userId', SendFriendRequest)
  .patch('/:userId', AcceptFriendRequest);

export default router;
