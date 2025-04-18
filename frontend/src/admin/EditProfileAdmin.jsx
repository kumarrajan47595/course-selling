import React, { useState } from "react";
import logo from "../../public/favicon.ico";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
function EditProfileAdmin() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem("admin"));
            const token = user.token;
            console.log(token);
            if (!token) {
                toast.error("Sign in to edit Profile")
                navigate("/signin");
            }
            const response = await axios.post(
                "http://localhost:400/api/v1/admin/profileupdate",
                {
                    firstName,
                    lastName,
                    email,
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Edited successful: ", response.data);
            toast.success(response.data.message);
            navigate("/admin/profile");
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.errors || "edit profile failed!!!");
            }
        }
    };

    return (
        <div className="bg-gradient-to-r from-black to-blue-950 ">
            <div className="h-screen container mx-auto flex  items-center justify-center text-white">
                {/* Header */}
                <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5  ">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                        <Link to={"/"} className="text-xl font-bold text-orange-500">
                            Postulate
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to={"/admin/signin"}
                            className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
                        >
                            Signin
                        </Link>
                        <Link
                            to={"/courses"}
                            className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md"
                        >
                            Join now
                        </Link>
                    </div>
                </header>

                {/* edit Form */}
                <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] m-8 md:m-0 mt-20">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Edit Profile<span className="text-orange-500"></span>
                    </h2>
                    <p className="text-center text-gray-400 mb-6">
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className=" text-gray-400 mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="name@email.com"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className=" text-gray-400 mb-2">
                                FirstName
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className=" text-gray-400 mb-2">
                                LastName
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="firstName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="mb-4 text-red-500 text-center">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
                        >
                            edit Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfileAdmin;