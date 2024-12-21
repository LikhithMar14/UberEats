import { Router } from 'express';
import { login, signup, verifyEmail } from '../controllers/user.controller';

const router = Router();



router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/verify-email').post(verifyEmail)

export default router