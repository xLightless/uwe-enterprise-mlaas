import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
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

    return (
        <div className="container-primary p-5">
            <p className="text-2xl font-bold p-2 rounded-md text-white bg-gray-500">User Details</p>

            <div className="flex flex-col items-center gap-5 p-5">
                <div className="flex flex-row">
                    <div className="flex flex-col justify-center p-5 rounded-tl-lg rounded-bl-lg bg-blue-500">
                        <FontAwesomeIcon icon={faUser} className="text-4xl text-white mb-2" />

                        <label className="font-bold text-white">User ID</label>
                        <p className="text-white">{userDetails.user_id}</p>
                    </div>

                    <div className="flex flex-col justify-center gap-5 p-5 rounded-tr-lg rounded-br-lg border-t border-b border-r">
                        <div>
                            <label className="font-bold">Created At</label>
                            <p>{userDetails.created_at}</p>
                        </div>

                        <div>
                            <label className="font-bold">Last Login</label>
                            <p>{userDetails.last_login}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="font-bold">Full Name</label>
                    <div className="flex items-center gap-5">
                        <p>{userDetails.full_name}</p>
                        <button onClick={() => openEdit("full_name", userDetails.full_name)} className="cursor-pointer p-1 rounded-md text-white bg-blue-500 hover:bg-blue-400">Update</button>
                    </div>
                </div>

                <div>
                    <label className="font-bold">Email</label>
                    <div className="flex items-center gap-5">
                        <p>{userDetails.email}</p>
                        <button onClick={() => openEdit("email", userDetails.email)} className="cursor-pointer p-1 rounded-md text-white bg-blue-500 hover:bg-blue-400">Update</button>
                    </div>
                </div>

                <div>
                    <label className="font-bold">Phone Number</label>
                    <div className="flex items-center gap-5">
                        <p>{userDetails.phone_number}</p>
                        <button onClick={() => openEdit("phone_number", userDetails.phone_number)} className="cursor-pointer p-1 rounded-md text-white bg-blue-500 hover:bg-blue-400">Update</button>
                    </div>
                </div>

                <button onClick={openPasswordChange} className="cursor-pointer p-2 rounded-md text-white bg-blue-500 hover:bg-blue-400">Change Password</button>
            </div>

            {isEditOpen && (
                <div className="fixed inset-0 flex justify-center items-center overlay/20 backdrop-blur-sm z-50">
                    <div className="p-5 w-96 rounded-md shadow-lg border bg-white">
                        <h2 className="text-xl font-bold mb-4">Update {currentField.replace("_", " ")}</h2>

                        <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="p-2 mb-4 w-full rounded-md border"/>

                        <div className="flex justify-end gap-2">
                            <button onClick={closeEdit} className="cursor-pointer px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-400">Cancel</button>
                            <button onClick={handleSave} className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-400">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {isPasswordChangeOpen && (
                <div className="fixed inset-0 flex justify-center items-center overlay/20 backdrop-blur-sm z-50">
                    <div className="p-5 w-96 rounded-md shadow-lg border bg-white">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>

                        <input type="password" placeholder="Current Password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="p-2 mb-4 w-full rounded-md border"/>

                        <input type="password" placeholder="New Password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="p-2 mb-4 w-full rounded-md border"/>

                        <div className="flex justify-end gap-2">
                            <button onClick={closePasswordChange} className="cursor-pointer px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-400">Cancel</button>
                            <button onClick={handlePasswordChange} className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-400">Change</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;