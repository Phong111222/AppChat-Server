import { Router } from 'express';
import { Login, Register } from '../controller/Auth';

const router = Router();

router.post('/register', Register).post('/login', Login);

export default router;
