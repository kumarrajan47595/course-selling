import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function BlockUser() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
        toast.error("Please signin to admin");
        navigate("/admin/signin");
    }
    useEffect(() => {
        const users = async () => {
            const user = await axios.get("http://localhost:400/api/v1/admin/active/student", {
                withCredentials: true
            })
            console.log(user.data.user);
            setUsers(user.data.user);
        }
        users();
    }, [])
    const handleBlock = async (id) => {
        try {
            const res = await axios.put(`http://localhost:400/api/v1/admin/block/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            })
            console.log(res.data);
            toast.success("Student is blocked");
        } catch (error) {
            console.log(error);
            toast.error("Error in block user");
        }
    }
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user._id} className="bg-white shadow-md rounded-lg p-4">
                        <p>FirstName: {user.firstName}</p>
                        <p>LastName: {user.lastName}</p>
                        <p>Email: {user.email}</p>
                        <button className="bg-black text-white p-1 rounded" onClick={() => handleBlock(user._id)}>Block</button>
                    </div>
                ))}
            </div>
        </>
    )
}
export default BlockUser;