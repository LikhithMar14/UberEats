import { Router } from 'express';
import { login, signup } from '../controllers/user.controller';

const router = Router();



router.route('/signin').post(signup)
router.route('/login').post(login)

export default router