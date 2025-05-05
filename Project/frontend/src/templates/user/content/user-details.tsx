import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faEnvelope, faPhone, faKey, faEdit, faClock } from '@fortawesome/free-solid-svg-icons';
import { fetchUserSettings } from "../../../repositories/auth";
import { updateUserDetails } from "../../../repositories/user";

const UserDetails: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        user_id: "",
        full_name: "",
        email: "",
        phone_number: "",
        created_at: "",
        last_login: "",
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchUserSettings();

                setUserDetails({
                    user_id: data.user_id || "N/A",
                    full_name: data.full_name || "N/A",
                    email: data.email || "N/A",
                    phone_number: data.phone_number || "N/A",
                    created_at: data.created_at || "N/A",
                    last_login: data.last_login || "N/A",
                });
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            }
        };

        fetchDetails();
    }, []);

    const openEdit = (field: string, value: string) => {
        setCurrentField(field);
        setCurrentValue(value);
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setCurrentField("");
        setCurrentValue("");
    };

    const handleSave = async () => {
        try {
            const updateData = { [currentField]: currentValue };
            const updatedData = await updateUserDetails(updateData);

            setUserDetails((prevDetails) => ({
                ...prevDetails,
                [currentField]: updatedData[currentField],
            }));

            closeEdit();
        } catch (err) {
            console.error("Failed to update user details:", err);
        }
    };

    const openPasswordChange = () => {
        setIsPasswordChangeOpen(true);
    };

    const closePasswordChange = () => {
        setIsPasswordChangeOpen(false);
        setPasswordData({ current_password: "", new_password: "" });
    };

    const handlePasswordChange = async () => {
        try {
            await updateUserDetails(passwordData);
            closePasswordChange();
        } catch (err) {
            console.error("Failed to change password:", err);
        }
    };

    const formatDate = (dateString: string) => {
        if (dateString === "N/A") return dateString;
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="container-primary bg-gray-50 p-6">
            <div className="flex flex-col gap-5 mb-8 max-w-[800px] mx-auto">
                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                        <p className="text-white font-bold text-xl">Account Information</p>
                        <p className="text-blue-100 text-sm">Your basic account details</p>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="text-white text-5xl" />
                                </div>
                            </div>
                            
                            <div className="w-full md:w-2/3">
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-500">USER ID</p>
                                    <p className="text-lg font-semibold">{userDetails.user_id}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Created On</p>
                                            <p>{formatDate(userDetails.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Last Login</p>
                                            <p>{formatDate(userDetails.last_login)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                        <p className="text-white font-bold text-xl">Personal Details</p>
                        <p className="text-blue-100 text-sm">Manage your personal information</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{userDetails.full_name}</p>
                                </div>
                            </div>

                            <button onClick={() => openEdit("full_name", userDetails.full_name)} className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1">
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium">{userDetails.email}</p>
                                </div>
                            </div>

                            <button onClick={() => openEdit("email", userDetails.email)} className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1">
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{userDetails.phone_number}</p>
                                </div>
                            </div>

                            <button onClick={() => openEdit("phone_number", userDetails.phone_number)} className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1">
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faKey} className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Password</p>
                                    <p className="font-medium">••••••••</p>
                                </div>
                            </div>

                            <button onClick={openPasswordChange} className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1">
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Change</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Update {currentField.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="text-blue-100 text-sm">Enter your new information below</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fieldValue">New {currentField.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
                                <input 
                                    id="fieldValue"
                                    type="text" 
                                    value={currentValue} 
                                    onChange={(e) => setCurrentValue(e.target.value)} 
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg transition-all"
                                />
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between gap-3">
                            <button onClick={closeEdit} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="cursor-pointer py-2 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {isPasswordChangeOpen && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black/20 backdrop-blur-sm z-[100]">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4">
                            <p className="text-white font-bold text-xl">Change Password</p>
                            <p className="text-blue-100 text-sm">Update your account password</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="currentPassword">Current Password</label>
                                <input 
                                    id="currentPassword"
                                    type="password" 
                                    placeholder="Enter your current password" 
                                    value={passwordData.current_password} 
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                                <input 
                                    id="newPassword"
                                    type="password" 
                                    placeholder="Enter your new password" 
                                    value={passwordData.new_password} 
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="mb-1">Password must:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Be at least 8 characters long</li>
                                    <li>Include at least one uppercase letter</li>
                                    <li>Include at least one number</li>
                                    <li>Include at least one special character</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between gap-3">
                            <button onClick={closePasswordChange} className="cursor-pointer py-2 px-6 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            
                            <button 
                                onClick={handlePasswordChange} 
                                className="cursor-pointer py-2 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors" 
                                disabled={!passwordData.current_password || !passwordData.new_password}>
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;