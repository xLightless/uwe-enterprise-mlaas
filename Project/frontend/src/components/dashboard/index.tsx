import { faTimes, faBars, faSearch, faUser, faCog, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../../templates/admin/components/sidebar";
import { Scrollbar } from "../scrollbar";
import { SidebarItem } from "../../common/interfaces";
import { createPortal } from "react-dom";
import { KeyboardCloseEvent } from "../../events/keyboard";

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
    children: React.ReactNode;
    sideBarItems: SidebarItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ sideBarItems, children }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
    const [isHambugerClicked, setIsHamburgerClicked] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);

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

    function toggleProfileDropdown() {
        setIsProfileClicked(!isProfileClicked);
    };

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
                    className="pl-4 w-full h-full border-b border-gray-200 space-x-4 grid grid-cols-[auto_1fr_1fr]" // flex flex-row items-center
                >

                    {/* Hamburger */}
                    <div className='w-full flex items-center'>
                        <div onClick={toggleSidebar} className="cursor-pointer w-4">
                            {isHambugerClicked ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
                        </div>
                    </div>

                    {/* Search contents of the display */}
                    <div className='w-full flex items-center'>
                        <form onSubmit={(e) => e.preventDefault()} className='w-full'>
                            <div className='relative max-w-lg w-full'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <FontAwesomeIcon icon={faSearch} className='text-gray-400'/>
                                </div>
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Search"
                                />
                                <button type='submit' className='sr-only'>Submit</button>
                            </div>
                        </form>
                    </div>

                    {/* User Settings */}
                    <div className='w-full flex justify-end items-center'>
                        <div className="h-full w-[150px] flex flex-row justify-end items-center space-x-4 bg-gray-800 px-4 cursor-pointer hover:bg-gray-700" onClick={toggleProfileDropdown}>

                            {/* Avatar */}
                            <div className='w-[36px] h-full flex justify-center items-center'>
                                <div className='w-[36px] h-[36px] rounded-full bg-white flex justify-center items-center'>
                                    <FontAwesomeIcon icon={faUser} className='text-gray-800'/>
                                </div>
                            </div>

                            {/* First Name */}
                            <div className="w-[74px] h-full flex justify-center items-center">
                                <p className='text-white'>lightless</p>
                            </div>
                        </div>

                        {isProfileClicked && (
                            <div className="absolute top-[63px] right-0 w-[150px] bg-gray-300 z-10 border-l border-b border-r" onMouseLeave={toggleProfileDropdown}>
                                <ul className="">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-2">
                                        <FontAwesomeIcon icon={faCog} />
                                        <span>Settings</span>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-2">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                        <span>Logout</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Directory */}
                <div className='w-full h-screen'>
                    <Scrollbar position='right'>
                        <div className="w-full h-screen">
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