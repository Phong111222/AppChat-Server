import { Router } from 'express';
import {
  CreateSingleRoom,
  GetAllSingleRooms,
  GetAllSingleRoomsByUser,
  CreateGroupRoom,
  AddUsersIntoGroup,
} from '../controller/Rooms';

const router = Router();

router
  .post('/', CreateSingleRoom)
  .post('/group', CreateGroupRoom)
  .patch('/group/:roomId', AddUsersIntoGroup)
  .get('/singleRooms', GetAllSingleRooms)
  .get('/singleRooms/:userId', GetAllSingleRoomsByUser);

export default router;
