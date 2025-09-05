import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import type { Notification } from "../Models/Notification";
import NotificationToast from "./NotificationToast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        password: "",
        phone_number: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const addNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    function validateForm(): boolean {
        if (!formData.full_name.trim()) {
            addNotification("Full name is required.", "error");
            return false;
        }
        if (!formData.username.trim()) {
            addNotification("Username is required.", "error");
            return false;
        }
        if (!formData.password) {
            addNotification("Password is required.", "error");
            return false;
        }
        if (formData.password.length < 6) {
            addNotification("Password must be at least 6 characters long.", "error");
            return false;
        }
        if (!formData.phone_number.trim()) {
            addNotification("Phone number is required.", "error");
            return false;
        }
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(formData.phone_number)) {
            addNotification("Please enter a valid phone number", "error");
            return false;
        }
        return true;
    };


    async function handleRegister(e: React.FormEvent): Promise<void> {
        
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const url = "http://localhost:5067/api/register";
        
        try {
            const response = await axios.post(url, formData);
            addNotification("Registered successfully.", "success");
            setIsLoading(false);
            setTimeout(() => navigate('/'), 2000);
        } catch (error: unknown) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    addNotification(error.response.data?.message,"error")
                } else if (error.request) {
                    addNotification("Unable to reach the server. Please check your internet connection and try again.","error")
                }
            }
            else{ addNotification("Unexpected error occurred.", "error"); }
        }

    };

    return (

        /* Parent Container */
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">

            {notification && <NotificationToast notification={notification} onClose={() => setNotification(null)} />}

            {/* Main ontainer */}
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">

                {/* Main container header*/}
                <div className="mb-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen className="w-10 h-10 text-green-900" />
                        <h1 className="text-2xl font-bold text-green-900">eLibrary</h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Sign up to get started</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Enter your full name"
                            autoFocus={true}
                            className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm "
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                            placeholder="Choose a username"
                            className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                            placeholder="Enter your phone number"
                            className="block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="Create a password (min. 6 characters)"
                                className="block w-full p-2 pr-10 border-gray-300 rounded-md shadow-sm "
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-700"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 font-semibold text-white bg-green-900 rounded-lg hover:bg-green-700 disabled:opacity-50"                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Link to registeration page */}
                <div className="pt-4 mt-6 text-center border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Already have an account?
                        <a
                            href="/"
                            className="ml-1 text-green-900 hover:underline"
                        >
                            Sign in here
                        </a>
                    </p>
                </div>

            </div>

        </div>
    );
}
