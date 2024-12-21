import { Router } from 'express';
import { forgotPassword, login, logOut, signup, verifyEmail } from '../controllers/user.controller';

const router = Router();



router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/verify-email').post(verifyEmail)
router.route('/logout').post(logOut)
router.route('/forgot-password').post(forgotPassword)
export default router