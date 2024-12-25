import { Router } from 'express';
import { generateSession, checkAuth,forgotPassword, login, logOut, resetPassword, signup, updateProfile, verifyEmail } from '../controllers/user.controller';
import upload from '../middlewares/multer.middleware';
import { verifyToken } from '../middlewares/auth.middleware';
const router = Router();



router.route('/signup').post(signup)//Testing Done
router.route('/login').post(login)//Testing Done
router.route('/verify-email').post(verifyEmail)//Testing Done
router.route('/logout').post(logOut)//Testing Done
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)
router.route('/profile/update').put(verifyToken,upload.fields([{name:'profilePicture',maxCount:1}]),updateProfile)

router.route("/check-auth").get(verifyToken, checkAuth);
router.route('/generate-session').post(generateSession)


export default router