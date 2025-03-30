import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { SidebarItem } from "../../common/interfaces";
import { createPortal } from "react-dom";
import { KeyboardCloseEvent } from "../../events/keyboard";
import Sidebar from "./sidebar";
import Searchbar from "../searchbar";
import UserSettingsDropdown from "../user-settings";
import { Scrollbar } from "../scrollbar";

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
    onDisplayUpdate?: (display: string) => void;
    children: React.ReactNode;
}

/**
 * A reusable component for creating dashboard interfaces with dynamic content.
 * It includes a sidebar for navigation, a search bar, and user settings dropdown.
 * The sidebar can be toggled on smaller screens, and the search bar allows users to filter content within the dashboard.
 *
 * @param {onDisplayUpdate} - A callback function to handle display updates when a sidebar item is clicked.
 * @param {sideBarItems} - An array of sidebar items to be displayed in the sidebar.
 * @param {children} - The content to be displayed within the dashboard.
 */
const Dashboard: React.FC<DashboardProps> = ({ sideBarItems, onDisplayUpdate, children }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
    const [isHambugerClicked, setIsHamburgerClicked] = useState(false);
    const [dashboardSearchTerm, setDashboardSearchTerm] = useState<string>("");

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
        <div className='relative bg-gray-200 w-full h-screen overflow-hidden'>
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
                        className="relative pl-4 w-full h-full border-b border-gray-200 space-x-4 grid grid-cols-[auto_auto_1fr] sticky top-0 bg-[#eeeeee] z-100"
                    >

                        {dashboardSearchTerm &&
                            <div className='absolute top-[65px] left-0 bg-gray-200 w-full z-100 border-b border-gray-300'>
                                <Scrollbar>
                                    <div
                                        className='w-full max-h-52 grid grid-rows-auto gap-2 p-4'
                                        onMouseLeave={() => setDashboardSearchTerm("")}
                                    >
                                        {sideBarItems.flatMap((item) =>
                                            item.items.filter((subItem) =>
                                                subItem[0].toLowerCase().includes(dashboardSearchTerm.toLowerCase())
                                            )
                                        ).length === 0 ? (
                                            // Render "No match found" if no items match
                                            <div className="w-full text-center text-gray-500 py-4">
                                                No match found
                                            </div>
                                        ) : (
                                            // Render matching items
                                            sideBarItems.flatMap((item, index) =>
                                                item.items
                                                    .filter((subItem) =>
                                                        subItem[0].toLowerCase().includes(dashboardSearchTerm.toLowerCase())
                                                    )
                                                    .map((subItem, subIndex) => (
                                                        <div
                                                            key={`${index}-${subIndex}`}
                                                            className="w-full flex items-start justify-start space-x-4 px-4 hover:bg-gray-300 hover:cursor-pointer py-2 rounded-lg"
                                                            onClick={() => {
                                                                // Handles the display change when clicked in the search dropdown
                                                                onDisplayUpdate && onDisplayUpdate(subItem[0]);
                                                            }}
                                                        >
                                                            <h1 className="text-gray-400 font-bold">{subItem[0]}</h1>
                                                            <div>{subItem[2]}</div>
                                                        </div>
                                                    ))
                                            )
                                        )}
                                    </div>
                                </Scrollbar>
                            </div>
                        }


                        {/* Hamburger */}
                        <div className='w-full flex items-center'>
                            <div onClick={toggleSidebar} className="cursor-pointer w-4">
                                {isHambugerClicked ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
                            </div>
                        </div>

                        {/* Search contents of the display */}
                        <div className='w-full flex items-center'>
                            <Searchbar placeholder={`Search dashboard...`}
                                onSearchChange={(searchTerm) => {
                                    console.log(searchTerm);
                                    setDashboardSearchTerm(searchTerm);
                                }}
                                value={dashboardSearchTerm}
                            />
                        </div>

                        {/* User Settings */}
                        <div className='w-full w-full items-end flex justify-end items-center'>
                            <UserSettingsDropdown user={{ fullName: "John Doe", email: "john.doe@example.com" }}/>
                        </div>
                    </div>

                    {/* Dashboard Directory */}
                    <div className='relative w-full h-full'>

                        {/* Contents */}
                        <Scrollbar paddingLeft="4">
                            <div className="w-full h-[calc(100vh-80px)] py-4">
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