import { faUser, faCog, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { UserProps } from "../../common/interfaces";

const UserSettingsDropdown: React.FC<UserProps & { operation?: () => void }> = ({ user }) => {
    const [isProfileClicked, setIsProfileClicked] = useState(false);

    async function logoutUser() {
        // Replace with actual fetch request
        return true;
    }

    async function openUserSettings() {
        // Replace with actual fetch request
        return true;
    }

    function toggleProfileDropdown() {
        setIsProfileClicked(!isProfileClicked);
    };
    return (
        <>
            <div className="relative flex justify-center w-fit max-w-[150px] h-full items-center bg-gray-800 cursor-pointer hover:bg-gray-700 px-4" onClick={toggleProfileDropdown}>

                {/* Avatar */}
                <div className='w-[36px] h-full flex justify-center items-center mr-1'>
                    <div className='w-[36px] h-[36px] rounded-full bg-white flex justify-center items-center'>
                        <FontAwesomeIcon icon={faUser} className='text-gray-800'/>
                    </div>
                </div>

                {/* First Name */}
                <div className="w-[74px] h-full flex justify-center items-center ml-1">
                    <p className='text-white'>{user.fullName}</p>
                </div>

                {isProfileClicked && (
                <div className="absolute top-full left-0 right-0 w-full max-w-[150px] bg-gray-300 z-10 border-l border-b border-r" onMouseLeave={toggleProfileDropdown}>
                    <ul className="">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-2" onClick={openUserSettings}>
                            <FontAwesomeIcon icon={faCog} />
                            <span>Settings</span>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-2" onClick={logoutUser}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            <span>Logout</span>
                        </li>
                    </ul>
                </div>
            )}
            </div>
        </>
    )
};

export default UserSettingsDropdown