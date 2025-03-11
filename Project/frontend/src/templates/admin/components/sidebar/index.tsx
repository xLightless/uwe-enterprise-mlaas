import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { JSX, useCallback, useEffect, useState } from "react";
import { SidebarItem } from "../../../../common/interfaces";

interface SidebarItemProps {
    name: string;
    sideBarIcon: JSX.Element;
    items: [string, () => void | null, JSX.Element | null][];
    indexes: number;
    clickedItemIndex: number | null;
    setClickedItemIndex: (index: number | null) => void;
    openDropDownIndex: number | null;
    setOpenDropdownIndex: (index: number | null) => void;
}

const SidebarItems: React.FC<SidebarItemProps> = ({
    name,
    sideBarIcon,
    items,
    indexes,
    clickedItemIndex,
    setClickedItemIndex,
    openDropDownIndex,
    setOpenDropdownIndex,
}) => {
    const [showItems, setShowItems] = useState(false);
    const toggleShowItems = useCallback(() => {
        if (showItems) {
            setShowItems(false);
            setOpenDropdownIndex(null);
        } else {
            setShowItems(true);
            setOpenDropdownIndex(indexes);
        }
    }, [showItems, indexes, setOpenDropdownIndex]);

    const monitorClickedItem = useCallback((item: number) => {
        const globalIndex = indexes + item;
        setClickedItemIndex(globalIndex);
        if (items[item][1]) {
            items[item][1]!();
        }
    }, [items, indexes, setClickedItemIndex]);

    useEffect(() => {
        setShowItems(openDropDownIndex === indexes);
    }, [openDropDownIndex, indexes]);

    return (
        <>
            <div className="flex flex-col items-center justify-center h-[50px] border hover:bg-gray-700 cursor-pointer" onClick={toggleShowItems}>
                <div className={`flex justify-between items-center w-full px-4`}>
                    <div className="text-gray-400">
                        {sideBarIcon}
                    </div>

                    <p className="text-gray-400 font-bold">
                        {name}
                    </p>

                    <div>
                        {showItems ? <FontAwesomeIcon icon={faCaretUp} className="text-gray-400"/> : <FontAwesomeIcon icon={faCaretDown} className="text-gray-400"/>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols[auto_1fr]">
                {items && showItems && (
                    <div className="flex flex-col items-center justify-center">
                        {items.map((item, index) => (
                            <div className="flex flex-row justify-between w-full" key={indexes + index}>
                                <div className={`min-h-full w-[5px] ${clickedItemIndex === indexes + index ? 'bg-purple-900' : 'bg-gray-900'}`}></div>
                                <div
                                    className={`w-full h-[50px] border-b hover:bg-gray-700 flex items-center justify-between px-4 cursor-pointer text-[14px] font-bold`}
                                    onClick={() => monitorClickedItem(index)}
                                >

                                    {/* Text */}
                                    <p className={`${clickedItemIndex === indexes + index ? 'text-gray-400' : 'text-gray-500'}`}>{item[0]}</p>

                                    {/* Icon */}
                                    <div className={`${clickedItemIndex === indexes + index ? 'text-gray-400' : 'text-gray-500'}`}>{item[2]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
};

interface SidebarProps {
    sidebarItems: SidebarItem[];
}


const Sidebar: React.FC<SidebarProps> = ({ sidebarItems }) => {
    const [clickedItemIndex, setClickedItemIndex] = useState<number | null>(() => {
        const storedClickedItemIndex = localStorage.getItem('clickedItemIndex');
        return storedClickedItemIndex !== null ? parseInt(storedClickedItemIndex, 10) : null;
    });

    const [openDropDownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    useEffect(() => {
        if (clickedItemIndex !== null) {
            localStorage.setItem('clickedItemIndex', clickedItemIndex.toString());
        }
    }, [clickedItemIndex]);

    let indexes = 0;

    return (
    <div className="border-r shadow-lg bg-gray-800 w-[250px] h-full flex flex-col">
        <div className="h-[65px] border-b border-gray-200 flex items-center justify-center">
            <h1 className="!text-white font-bold text-xl">Company Name</h1>
        </div>


        {sidebarItems.map((data, idx) => {
                const currentIndexes = indexes;
                indexes += data.items.length;
                return (
                    <SidebarItems
                        key={idx}
                        name={data.name}
                        sideBarIcon={data.sideBarIcon}
                        items={data.items}
                        indexes={currentIndexes}
                        clickedItemIndex={clickedItemIndex}
                        setClickedItemIndex={setClickedItemIndex}
                        openDropDownIndex={openDropDownIndex}
                        setOpenDropdownIndex={setOpenDropdownIndex}
                    />
                );
            })}

    </div>
    )
};

export default Sidebar;