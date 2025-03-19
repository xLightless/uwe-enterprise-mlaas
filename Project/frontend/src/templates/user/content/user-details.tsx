import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UserDetails: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        user_id: "12345",
        full_name: "John Doe",
        email: "johndoe@example.com",
        phone_number: "7777 777777",
        created_at: "2025-03-01 12:00:00",
        last_login: "2025-03-12 15:30:00",
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [currentValue, setCurrentValue] = useState("");

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

    const handleSave = () => {
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [currentField]: currentValue,
        }));
        closeEdit();
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
        </div>
    );
};

export default UserDetails;