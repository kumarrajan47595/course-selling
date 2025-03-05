import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddFeedback = () => {
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("Easy");
    const [message, setMessage] = useState("");
    const { courseId } = useParams();
    const navigate=useNavigate();
    console.log(courseId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const feedbackData = {
            courseId,
            rating: parseInt(rating),
            comment,
            difficultyLevel,
        };

        try {
            const response = await axios.post("http://localhost:400/api/v1/feedback/create", feedbackData);
            setMessage("Feedback submitted successfully!");
            setRating("");
            setComment("");
            setDifficultyLevel("Easy");
            navigate('/purchases');
        } catch (error) {
            setMessage("Error submitting feedback. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Submit Your Feedback</h2>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>

                {/* Rating */}
                <label>Rating (1-5):</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>

                {/* Comment */}
                <label>Comment:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    rows="4"
                    required
                />

                {/* Difficulty Level */}
                <label>Difficulty Level:</label>
                <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} required>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                {/* Would Recommend */}


                {/* Submit Button */}
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: "800px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" },
    form: { display: "flex", flexDirection: "column" },
    message: { color: "green" }
};

export default AddFeedback;
