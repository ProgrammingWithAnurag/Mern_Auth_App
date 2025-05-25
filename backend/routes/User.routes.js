import { Router } from "express";
import { forgotPassword, Login, Logout, resendOTP, resetPassword, Signup, verifyAccount } from "../controllers/User.controllers.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = Router();

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/logout',Logout)
router.post('/verify',isAuthenticated,verifyAccount)
router.post('/resend-otp',isAuthenticated,resendOTP)
router.post('/forget-password',forgotPassword)
router.post('/reset-password',resetPassword)

export default router