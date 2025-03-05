import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function SeeFeedback() {
    const { courseId } = useParams();
    const [feedback, setFeedback] = useState([]);
    useEffect(() => {
        const fetchFeedback = async () => {
            const response = await axios.get(`http://localhost:400/api/v1/feedback/${courseId}`)
            console.log(response);
            setFeedback(response.data);
        };
        fetchFeedback();
    }, [])
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedback.length>0 ?( feedback.map((feedback) => (
                    <div key={feedback._id} className="bg-white shadow-md rounded-lg p-4">
                        <p>Comment: {feedback.comment}</p>
                        <p>DifficultyLevel: {feedback.difficultyLevel}</p>
                        <p>Rating: {feedback.rating}</p>
                    </div>
                ))):(<p>No there is no any review for this course</p>)}
            </div>
        </>
    )
}

export default SeeFeedback;