import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
    const [admin, setAdmin] = useState([]);
    const navigate = useNavigate();
    const admins = JSON.parse(localStorage.getItem("admin"));
    const token = admins.token;
    if (!token) {
        toast.error("Please signin to admin");
        navigate("/admin/signin");
    }
    useEffect(() => {
        const admins = async () => {
            const admin = await axios.post("http://localhost:400/api/v1/admin/profile", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(token);
            console.log(admin.data.admin);
            setAdmin(admin.data.admin);
        };
        admins();
    }, [])
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h1>Admin Profile details</h1>
            <p>FirstName:{admin.firstName}</p>
            <p>LastName:{admin.lastName}</p>
            <p>Email:{admin.email}</p>
            <Link to={"/admin/profile/edit"} className="bg-black p-2 rounded">Edit</Link>
            </div>
        </div>
    )
}

export default Profile;