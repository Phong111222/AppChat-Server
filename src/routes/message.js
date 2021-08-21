import { Router } from 'express';
import {
  CreateSingleMessage,
  GetSingleRoomMessages,
} from '../controller/Message';
// import asyncMiddleware from '../middleware/asyncMiddleware';
import mongoUpload from '../middleware/mongoUpload';
// import SuccessResponse from '../model/response/SuccessResponse';

const router = Router();

router
  .post(
    '/singleMessage/:roomId',
    mongoUpload.array('image', 10),
    CreateSingleMessage
  )
  .get('/singleMessage/:roomId', GetSingleRoomMessages);

export default router;
