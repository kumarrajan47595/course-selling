import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

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
        const existedUser = await Admin.findOne({ email: email });
        if (existedUser) {
            return res.status(200).json({
                message: "User Already registered"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Admin.create({
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
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(403).json({
                message: "User not registered"
            })
        }
        const isPassword = await bcrypt.compare(password, admin.password);
        if (!isPassword) {
            return res.status(403).json({ error: "Invalid credential" })
        }
        const token = jwt.sign({
            id: admin._id,
        }, config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }
        res.cookie("jwt", token, cookieOptions);
        res.status(201).json({ message: "Login successfully", admin, token });

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

export const changepassword = async (req, res) => {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword) {
        return res.status(404).json({ message: "All filed are required" });
    }
    try {
        const user = await Admin.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "You have not registered" });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ error: "YOu have entered wrong password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const changepassword = await Admin.findOneAndUpdate({
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
    const adminId = req.adminId;
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(400).json({ error: "User not exist" });
        }
        const courseCreated = await Course.find({
            creatorId: adminId
        })
        res.status(200).json({ Message: "See profile", admin, courseCreated })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Error in profile" })
    }
}

export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        await User.findByIdAndUpdate(userId, { status: "blocked" });
        res.status(200).json({ message: "User Blocked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error blocking user" });
    }
}

export const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndUpdate(userId, { status: "active" });

        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error unblocking user" });
    }
};

export const updateProfile = async (req, res) => {
    const adminId = req.adminId;
    const { firstName, lastName, email } = req.body;
    try {
        const user = await Admin.findById(usersId);
        if (!user) {
            return res.status(403).json({ Message: "user not found" });
        }
        const updateUser = await Admin.findByIdAndUpdate({ usersId }, {
            firstName: firstName,
            lastName: lastName,
            email: email
        })
        res.status(200).json({ message: "profile updated", updateUser });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Error in update profile" })
    }

}

export const studentaccount=async(req,res)=>{
    const {userId}=req.params;
    const student=await User.findById(userId);
    try {
    if (!student) {
        return res.status(404).json({Message:"Student not found"});
    }
    const course=await Course.findById(userId);
    res.status(200).json({Message:"Student detalis",student,course});
    } catch (error) {
        console.log(error);
        res.status(403).json({error:"Error in get Student account"})
    }
}

export const ActiveStudent=async(req,res)=>{
    try {
        const user=await User.find({status:"active"});
        res.status(200).json({Message:"User Details",user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Error in fetching user"});
    }
}

export const BlockStudent=async(req,res)=>{
    try {
        const user=await User.find({status:"blocked"});
        res.status(200).json({Message:"User Details",user});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Error in fetching user"});
    }
}