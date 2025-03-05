import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
function AddVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [documents, setDocuments] = useState("");
    const [video, setVideo] = useState("");
    const { courseId } = useParams();

    const navigate = useNavigate();


    const changeVideoHandler = (e) => {
        const file = e.target.files[0];
        setVideo(file);
    };
    const changeAssessmentHandler = (e) => {
        const file = e.target.files[0];
        setDocuments(file);
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", video);
        formData.append("documents", documents);

        const admin = JSON.parse(localStorage.getItem("admin"));
        const token = admin.token;
        if (!token) {
            navigate("/admin/signin");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:400/api/v1/course/addvideo/${courseId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            console.log(response.data);
            toast.success(response.data.message || "video added successfully");
            navigate("/admin/our-courses");
            setTitle("");
            setImage("");
            setDescription("");
            setVideo("");
            setDocuments("");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.errors);
        }
    };

    return (
        <div>
            <div className="min-h-screen  py-10">
                <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold mb-8">Add video</h3>

                    <form onSubmit={handleAddVideo} encType="multipart/form-data" className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-lg">Title</label>
                            <input
                                type="text"
                                placeholder="Enter your course title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg">Description</label>
                            <input
                                type="text"
                                placeholder="Enter your course description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-lg">Course Video</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={changeVideoHandler}
                                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-lg">Course Assessment</label>
                            <input
                                type="file"
                                accept="pdf/*"
                                onChange={changeAssessmentHandler}
                                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                        >
                            Add video
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddVideo;