import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    completed: {
        type: String,
        enum: ["uncompleted", "completed"], default: "uncompleted"
    }
})

export const Purchase = mongoose.model("Purchase", purchaseSchema);