import { Router } from 'express';
import { forgotPassword, login, logOut, resetPassword, signup, verifyEmail } from '../controllers/user.controller';

const router = Router();



router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/verify-email').post(verifyEmail)
router.route('/logout').post(logOut)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)
export default router