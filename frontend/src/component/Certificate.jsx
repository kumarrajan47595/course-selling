import { useState } from "react";
import axios from "axios";

const Certificate = ({ userName, courseName }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;
            console.log(token);
            if (!token) {
                toast.error("Sign in to change Password")
                navigate("/signin");
            }
            const response = await axios.post("http://localhost:400/api/v1/user/download-certificate", {
                userName,
                courseName
            }, { responseType: "blob",
                headers:{
                    Authorization:`Bearer ${token}`
                }
             });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${courseName}_Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading certificate:", error);
        }
        setLoading(false);
    };

    return (
        <button onClick={handleDownload} disabled={loading}>
            {loading ? "Generating..." : "Download Certificate"}
        </button>
    );
};

export default Certificate;
