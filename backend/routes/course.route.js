import express from "express";
import { addVideoToCourse, buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js";
import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";
const router=express.Router();

router.post('/create',adminMiddleware,createCourse);
router.put('/update/:courseId',adminMiddleware,updateCourse);
router.delete('/delete/:courseId',adminMiddleware,deleteCourse);
router.get('/courses',getCourses);
router.post('/addvideo/:courseId',adminMiddleware,addVideoToCourse);
router.post('/buy/:courseId',userMiddleware,buyCourses);

router.get('/:courseId',courseDetails);

export default router;