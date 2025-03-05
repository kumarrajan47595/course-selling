import { Feedback } from "../models/feedback.model.js";

export const createFeedback = async (req, res) => {
    try {
        const { courseId, userId, rating, comment, difficultyLevel } = req.body;
        if (!courseId  || !rating || !difficultyLevel) {
            return res.status(400).json({ error: "Required Field are missing!" });
        }
        const feedback = await Feedback.create({
            courseId: courseId,
            rating: rating,
            comment: comment,
            difficultyLevel: difficultyLevel
        })
        res.status(200).json({ Message: "Feedback added", feedback });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in create Feedback" })
    }
}

export const getFeedback = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const feedback = await Feedback.find({ courseId: courseId });
        if (feedback.length === 0) {
            return res.status(201).json({ Message: "No Feedback found for this courses" })
        }
        res.status(200).json(feedback);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error in get feedback" });
    }
}