import { Router } from 'express';
import { Register } from '../controller/Auth';

const router = Router();

router.post('/register', Register);

export default router;
