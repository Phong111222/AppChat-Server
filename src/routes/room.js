import { Router } from 'express';
import {
  CreateSingleRoom,
  GetAllSingleRooms,
  GetAllSingleRoomsByUser,
} from '../controller/Rooms';

const router = Router();

router
  .post('/', CreateSingleRoom)
  .get('/singleRooms', GetAllSingleRooms)
  .get('/singleRooms/:userId', GetAllSingleRoomsByUser);

export default router;
