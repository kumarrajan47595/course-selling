import express from "express";
import { createFeedback, getFeedback } from "../controllers/feedback.controller.js";
const router = express.Router();

router.post('/create', createFeedback)
router.get('/:courseId',getFeedback);

export default router;