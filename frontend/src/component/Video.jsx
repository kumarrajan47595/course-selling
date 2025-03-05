import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Video() {
    const { courseId } = useParams();
    const [video, setVideo] = useState([]);
    const [document, setDocument] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:400/api/v1/course/${courseId}`);
                setVideo(response.data.course.video);
                setDocument(response.data.course);
            } catch (error) {
                setErrorMessage("Failed to fetch fetchDetails data");
            }
        }
        fetchDetails();
    }, []);

    return (
        <>
            <div>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} { }
                {video.length === 0 ? (
                    <p>Loading videos...</p>
                ) : (
                    video.map((vide, index) => (
                        <video key={index} width="640" height="360" controls>
                            <source src={vide.url} type="video/mp4" />
                        </video>
                    ))
                )}
            </div>
            <h3>Documents:</h3>
            {document?.documents?.length > 0 ? (
                <ul>
                    {document.documents.map((doc, index) => (
                        <li key={index}>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                                Download {doc.format.toUpperCase()}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No documents available</p>
            )}
        </>
    );
}

export default Video;
