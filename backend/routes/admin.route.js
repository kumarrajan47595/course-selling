import express from "express";
import { ActiveStudent, BlockStudent, blockUser, changepassword, profile, signin, signout, signup, studentaccount, unblockUser, updateProfile } from "../controllers/admin.controller.js";
import adminMiddleware from "../middleware/admin.mid.js";
import { getTest, testCreate } from "../controllers/test.controller.js";

const router=express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.post('/changepassword',changepassword);
router.post('/profile',adminMiddleware,profile);
router.put('/block/:userId',adminMiddleware,blockUser);
router.put('/unblock/:userId',adminMiddleware,unblockUser);
router.post('/profileupdate',adminMiddleware,updateProfile);
router.post('/student/:userId',studentaccount);
router.get('/active/student',ActiveStudent);
router.get('/block/student',BlockStudent);


export default router;