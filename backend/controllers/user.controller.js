import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
    const userSchema = z.object({
        firstName: z.string().min(6, { message: "firstName must be atleast 6 char" }),
        lastName: z.string().min(6, { message: "lastname must be atleast 6 char " }),
        email: z.string().email(),
        password: z.string().min(8, { message: "password must be atleast 8 char" })
    })
    const validateDate = userSchema.safeParse(req.body);
    if (!validateDate.success) {
        return res.status(400).json({ error: validateDate.error.issues.map(err => err.message) });
    }
    try {
        const { firstName, lastName, email, password } = req.body;
        const existedUser = await User.findOne({ email: email });
        if (existedUser) {
            return res.status(200).json({
                message: "User Already registered"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(201).json({
            message: "Signup succedded",
            newUser
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Error while signup" });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                message: "User not registered"
            })
        }
        if (user.status == "blocked") {
            return res.status(403).json({ message: "You are blocked" });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(403).json({ error: "Invalid credential" })
        }
        const token = jwt.sign({
            id: user._id,
        }, config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login successfully", user, token });

    } catch (error) {
        console.log(error)
        res.status(404).json({ error: "Error while sign in " })
    }
}

export const signout = async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).json({ error: "Kindley login first" })
        }
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message: "Error while signout"
        })
    }
}

export const purchases = async (req, res) => {
    const userId = req.userId;
    try {
        const purchased = await Purchase.find({ userId });
        let purchasedCourseId = [];
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId);
        }
        const courseData = await Course.find({
            _id: { $in: purchasedCourseId },
        })
        res.status(200).json({ purchased, courseData })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in purchase" })
    }
}

export const changepassword = async (req, res) => {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword) {
        return res.status(404).json({ message: "All filed are required" });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "You have not registered" });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ error: "YOu have entered wrong password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const changepassword = await User.findOneAndUpdate({
            email: email
        }, {
            password: hashedPassword
        });
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error in change password" })
    }
}

export const profile = async (req, res) => {
    const usersId = req.userId;
    try {
        const user = await User.findById(usersId);
        if (!user) {
            return res.status(400).json({ error: "User not exist" });
        }
        const coursePurchased = await Purchase.find({
            userId: usersId
        })
        res.status(200).json({ Message: "See profile", user, coursePurchased })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Error in profile" })
    }
}

export const updateProfile = async (req, res) => {
    const usersId = req.userId;
    const { firstName, lastName, email } = req.body;
    try {
        const user = await User.findById(usersId);
        if (!user) {
            return res.status(403).json({ Message: "user not found" });
        }
        const updateUser = await User.findByIdAndUpdate(usersId, {
            firstName: firstName,
            lastName: lastName,
            email: email
        },
            { new: true, runValidators: true }
        )
        res.status(200).json({ message: "profile updated", updateUser });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Error in update profile" })
    }

}