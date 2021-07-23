import { Router } from 'express';
import { CreateRoom } from '../controller/Rooms';
// import authorizeMiddleware from '../middleware/authorizeMiddleware';

const router = Router();

router.post('/', CreateRoom);

export default router;
