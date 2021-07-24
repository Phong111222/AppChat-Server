import { Router } from 'express';
import { CreateSingleMessage } from '../controller/Message';

const router = Router();

router.post('/singleMessage/:roomId', CreateSingleMessage);

export default router;
