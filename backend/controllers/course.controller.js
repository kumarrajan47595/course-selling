import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";
import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;
    const { image, video } = req.files;
    console.log(req.files);
    console.log(req.body);
    if (!video || !image) {
        return res.json({ error: "video required" });
    }

    try {
        if (!title || !description || !price) {
            return res.status(200).json({ error: "All field are required" });
        }
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No files uploaded" })
        }
        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ error: "invalid file formet only png and jpg allowed" });
        }
        //upload photo on cloud 
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ error: "Error uploading file to cloudinary" });
        }
        const allowedVideoFormats = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
        if (!allowedVideoFormats.includes(video.mimetype)) {
            return res.status(400).json({ error: "Invalid video format (only MP4, MKV, AVI, MOV allowed)" });
        }
        console.log("Uploading video from:", video.tempFilePath);
        const cloud_response_content = await cloudinary.uploader.upload_large(video.tempFilePath, {
            resource_type: "video",
            timeout: 60000,
            chunk_size: 6000000
        })
        if (!cloud_response_content || cloud_response_content.error) {
            return res.status(400).json({ error: "Error while video uploading in cloudinary" })
        }
        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            },
            video: {
                public_id: cloud_response_content.public_id,
                url: cloud_response_content.secure_url
            },
            creatorId: adminId
        }
        const data = await Course.create(courseData);
        res.json({
            message: "Course created successfully",
            data
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error on creating course" });
    }
}

export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image } = req.body;
    try {
        const courseSerch = await Course.findById(courseId);
        if (!courseSerch) {
            return res.status(404).json({ error: "Course not found" })
        }
        const course = await Course.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            price,
            image: {
                public_id: image?.public_id,
                url: image?.url
            }
        });
        res.status(201).json({ message: "course updated successfully", course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error while updating course" })
    }
}

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    try {
        const courseSerch = await Course.findById(courseId);
        if (!courseSerch) {
            return res.status(404).json({ error: "Course not found" })
        }
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
        })
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in deleting course" });
    }
}

export const getCourses = async (req, res) => {
    try {
        const course = await Course.find({});
        res.status(200).json({
            message: "Course details",
            course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in getCourses" });
    }
}

export const courseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(200).json({ message: "Course not found" });
        }
        res.status(200).json({
            message: "Your course details",
            course
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in CourseDetails" })
    }
}

export const buyCourses = async (req, res) => {
    const { userId } = req;
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        const existingUser = await Purchase.findOne({ userId, courseId });
        if (existingUser) {
            return res.status(400).json({ message: "Courses already purchased" })
        }
        // stripe payment code goes here!!
        const amount = course.price;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.status(201).json({
            message: "Course purchased successfully",
            course,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in buy Courses" })
    }
}

export const addVideoToCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const { video } = req.files;
    if (!title || !video) {
        return res.status(403).json({ Message: "All fileds are required" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ Message: "Course not found" });
    }
    try {
        const allowedVideoFormats = ["video/mp4", "video/mkv", "video/avi", "video/mov"];
        if (!allowedVideoFormats.includes(video.mimetype)) {
            return res.status(400).json({ error: "Invalid video format (only MP4, MKV, AVI, MOV allowed)" });
        }
        const cloud_response_content = await cloudinary.uploader.upload(video.tempFilePath, {
            resource_type: "video"
        })
        if (!cloud_response_content || cloud_response_content.error) {
            return res.status(400).json({ error: "Error while video uploading in cloudinary" })
        }
        const public_id = cloud_response_content.public_id;
        const url = cloud_response_content.secure_url;
        course.video.push({ public_id, url, title, description });
        await course.save();
        res.status(200).json({ message: "Video added successfully", course });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Error in adding video" });
    }
}