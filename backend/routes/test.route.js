import express from "express";
import adminMiddleware from "../middleware/admin.mid.js";
import { deleteTest, getTest, testCreate, updateTest } from "../controllers/test.controller.js";

const router=express.Router();

router.post('/create',adminMiddleware,testCreate);
router.get('/tests',getTest);
router.post('/update/:testId',updateTest);
router.delete('/delete/:testId',adminMiddleware,deleteTest);

export default router;