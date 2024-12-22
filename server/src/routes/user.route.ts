import { Router } from 'express';
import { forgotPassword, generateSession, login, logOut, resetPassword, signup, updateProfile, verifyEmail } from '../controllers/user.controller';
import upload from '../middlewares/multer.middleware';
const router = Router();



router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/verify-email').post(verifyEmail)
router.route('/logout').post(logOut)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)
router.route('/profile/update').post(upload.fields([{name:'profilePicture',maxCount:1}]),updateProfile)
router.route('/generate-session').post(generateSession)


export default router