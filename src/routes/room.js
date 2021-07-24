import { Router } from 'express';
import { CreateSingleRoom, GetSingleRoom } from '../controller/Rooms';
// import authorizeMiddleware from '../middleware/authorizeMiddleware';

const router = Router();

router.post('/', CreateSingleRoom).get('/singleRooms', GetSingleRoom);

export default router;
