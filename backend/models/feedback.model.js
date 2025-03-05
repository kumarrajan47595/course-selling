import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true

    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    difficultyLevel: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Feedback = mongoose.model("Feedback", feedbackSchema);
