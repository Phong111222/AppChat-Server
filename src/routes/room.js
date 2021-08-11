import { Router } from 'express';
import {
  CreateSingleRoom,
  GetAllSingleRooms,
  GetAllSingleRoomsByUser,
  CreateGroupRoom,
} from '../controller/Rooms';

const router = Router();

router
  .post('/', CreateSingleRoom)
  .post('/group', CreateGroupRoom)
  .get('/singleRooms', GetAllSingleRooms)
  .get('/singleRooms/:userId', GetAllSingleRoomsByUser);

export default router;
