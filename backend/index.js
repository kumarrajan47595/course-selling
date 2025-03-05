import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js"
import adminRouter from "./routes/admin.route.js"
import orderRoute from "./routes/order.route.js"
import testRouter from "./routes/test.route.js"
import feedbackRoute from "./routes/feedback.route.js"
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from 'fs';

const router = express.Router();
const app = express();
dotenv.config();


let port = process.env.PORT || 500;

//middleware
app.use(router);
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200
}))
const tempDir = "/tmp/";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 100 * 1024 * 1024 } // Limit file size to 100MB
}));
//clodinary config
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
const connectDb = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
        res.json({
            "message": "Error on connect DB"
        })
    }
}

connectDb();

app.use('/api/v1/course', courseRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/test", testRouter);
app.use('/api/v1/feedback',feedbackRoute);

app.listen(port, () => {
    console.log("server is listing on " + port)
})