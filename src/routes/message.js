import { Router } from 'express';
import {
  CreateSingleMessage,
  GetSingleRoomMessages,
} from '../controller/Message';

const router = Router();

router
  .post('/singleMessage/:roomId', CreateSingleMessage)
  .get('/singleMessage/:roomId', GetSingleRoomMessages);

export default router;
