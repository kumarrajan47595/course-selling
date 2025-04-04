import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function ProfileUser() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const checkUser = JSON.parse(localStorage.getItem("user"));
    const token = checkUser.token;
    if (!checkUser) {
        toast.error("Please signin");
        navigate("/signin");
    }
    if (!token) {
        toast.error("Please signin");
        navigate("/signin");
    }
    useEffect(() => {
        const user = async () => {
            const users = await axios.post(`${BACKEND_URL}/user/profile`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(users);
            setUsers(users.data.user);
        }
        user();
    }, [])
    return <div className="flex items-center justify-center h-screen">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h1>User Profile details</h1>
            <p>FirstName:{users.firstName}</p>
            <p>LastName:{users.lastName}</p>
            <p>Email:{users.email}</p>
            <Link to={"/profile/edit"} className="bg-black p-2 rounded" >Edit</Link>
        </div>
    </div>
}

export default ProfileUser;