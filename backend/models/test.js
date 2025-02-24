import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    }
})

export const Test = mongoose.model("Test", testSchema);