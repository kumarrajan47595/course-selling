import express from "express";
import { changepassword, profile, purchases, signin, signout, signup, updateProfile } from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.mid.js";
const router=express.Router();

router.post('/signup',signup);
router.post('/signin',signin)
router.get('/signout',signout)
router.post('/changepassword',changepassword)
router.get('/purchases',userMiddleware,purchases);
router.post('/profile',userMiddleware,profile);
router.post('/profileupdate',userMiddleware,updateProfile);

export default router;