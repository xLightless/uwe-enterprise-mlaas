import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Scrollbar } from "../scrollbar";
import { SidebarItem } from "../../common/interfaces";
import { createPortal } from "react-dom";
import { KeyboardCloseEvent } from "../../events/keyboard";
import Sidebar from "./sidebar";
import Searchbar from "../searchbar";
import UserSettingsDropdown from "../user-settings";

interface OverlayAdminDashboardSidebarProps {
    sidebarItems: SidebarItem[];
    onClose: () => void;
};


const OverlayAdminDashboardSidebar: React.FC<OverlayAdminDashboardSidebarProps> = ({ sidebarItems, onClose }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    const checkOverlayUnmount = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!sidebarRef.current || !sidebarRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-gray-500/99 z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={checkOverlayUnmount}>
            <KeyboardCloseEvent operation={onClose} />
            <div className={`relative w-full h-full grid grid-cols-[auto_1fr]`}>
                <div ref={sidebarRef} className='w-fit h-full' id="overlay-sidebar">
                    <Sidebar sidebarItems={sidebarItems}/>
                </div>
                <div className='w-full h-[65px] flex justify-center items-center'>
                    <div className='w-full h-full flex justify-end items-center pr-4 cursor-pointer' onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};


interface DashboardProps {
    sideBarItems: SidebarItem[];
    children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ sideBarItems, children }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
    const [isHambugerClicked, setIsHamburgerClicked] = useState(false);

    function toggleSidebar() {
        setIsHamburgerClicked(!isHambugerClicked);


        if (window.innerWidth >= 1024) {
            setShowSidebar(!showSidebar);
            setShowSidebarOverlay(false);
        } else {
            setShowSidebar(false);
            setShowSidebarOverlay(!showSidebarOverlay);
        }
    }

    useEffect(() => {
        function monitorComponentResize() {
            if (isHambugerClicked) {
                if (window.innerWidth >= 1024) {
                    setShowSidebar(true);
                    setShowSidebarOverlay(false);
                } else {
                    setShowSidebar(false);
                    setShowSidebarOverlay(true);
                }
            }
        }

        if (isHambugerClicked) {
            if (window.innerWidth >= 1024) {
                setShowSidebar(true);
                setShowSidebarOverlay(false);
            } else {
                setShowSidebar(false);
                setShowSidebarOverlay(true);
            }
        } else {
            setShowSidebar(false);
            setShowSidebarOverlay(false);
        }

        window.addEventListener('resize', monitorComponentResize);
        return () => {
            window.removeEventListener('resize', monitorComponentResize);
        };
    }, [isHambugerClicked]);

    return (
    <div className='relative h-screen overflow-hidden'>
        <div className={`grid grid-cols-1 h-full ${showSidebar ? 'lg:grid-cols-[250px_1fr]' : ''}`}>
            {showSidebar && !showSidebarOverlay &&
                <div className='hidden lg:block'>
                    <Sidebar sidebarItems={sideBarItems}/>
                </div>
            }

            {!showSidebar && showSidebarOverlay && <OverlayAdminDashboardSidebar sidebarItems={sideBarItems} onClose={toggleSidebar}/>}

            {/* Page contents */}
            <div
                className="grid grid-rows-[65px_1fr]"
            >

                {/* Navigation */}
                <div
                    className="pl-4 w-full h-full border-b border-gray-200 space-x-4 grid grid-cols-[auto_auto_1fr]" // flex flex-row items-center
                >

                    {/* Hamburger */}
                    <div className='w-full flex items-center'>
                        <div onClick={toggleSidebar} className="cursor-pointer w-4">
                            {isHambugerClicked ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
                        </div>
                    </div>

                    {/* Search contents of the display */}
                    <div className='w-full flex items-center'>
                        <Searchbar placeholder={`Search dashboard...`}/>
                    </div>

                    {/* User Settings */}
                    <div className='w-full w-full items-end flex justify-end items-center'>
                        <UserSettingsDropdown user={{ fullName: "John Doe", email: "john.doe@example.com" }}/>
                    </div>
                </div>

                {/* Dashboard Directory */}
                <div className='w-full h-screen'>
                    <Scrollbar position='right' paddingLeft="4">
                        <div className="w-full h-screen py-4">
                            {children}
                        </div>
                    </Scrollbar>
                </div>
            </div>
        </div>
    </div>
    )
};


export default Dashboard;