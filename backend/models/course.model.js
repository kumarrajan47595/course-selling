import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    video: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    documents: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        title: {
            type: String
        },
        format: {
            type: String,
            enum: ["pdf", "doc", "docx"],  // Restricting formats to only PDF and Word files
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

export const Course = mongoose.model("Course", courseSchema);