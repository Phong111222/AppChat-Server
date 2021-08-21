import { Router } from 'express';
import { Login, Register } from '../controller/Auth';
import mongoUpload from '../middleware/mongoUpload';

const router = Router();

router
  .post('/register', mongoUpload.single('image'), Register)
  .post('/login', Login);

export default router;
