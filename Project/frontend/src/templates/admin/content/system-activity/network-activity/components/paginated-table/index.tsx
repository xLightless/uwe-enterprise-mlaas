import React, { useState } from "react";
import { ReactChildProp, TableData } from "../../../../../../../common/interfaces";
import Searchbar from "../../../../../../../components/searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import Overlay from "../../../../../../../components/overlay";

const PaginatedTable: React.FC<TableData & ReactChildProp> = ({ thead, tbody, maxRowsPerPage, onUserIdClick, children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilteredBy, setSelectedFilteredBy] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [userIdOverlay, setUserIdOverlay] = useState<boolean>(false);


    const rowsPerPage = maxRowsPerPage ? maxRowsPerPage : 10;
    const totalPages = Math.ceil(tbody.length / rowsPerPage);
    const startingIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = tbody.slice(startingIndex, startingIndex + rowsPerPage);

    function onNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    function onPreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function onFilterBy() {
        setSelectedFilteredBy(!selectedFilteredBy);
    };

    function onItemSelection(item: string) {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(item_ => item_ !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    }

    function isItemSelected(item: string) {
        return selectedItems.includes(item);
    }

    function toggleUserIdOverlay() {
        setUserIdOverlay(!userIdOverlay);
    }

    return (
        <div className="w-full h-fit bg-gray-200 rounded shadow-md p-4 grid grid-rows-[auto_1fr_auto grid-cols-1 gap-4">

            {/* flex justify-between items-center */}
            <div className="w-full h-fit flex flex-col md:flex-row md:justify-between md:items-center gap-4 ">

                {/* Filtering Options */}
                <div className="order-1 w-full md:w-fit relative w-1/2 grid grid-cols-2 gap-4">
                    <Searchbar placeholder="Search network activity..."/>

                    <div className="relative h-full w-fit flex justify-center items-center space-x-4">
                        <div
                            className="relative bg-gray-700 w-[200px] flex justify-center items-center rounded space-x-4 cursor-pointer px-2"
                            onClick={onFilterBy}
                        >
                            <input
                                id="filter-control"
                                className="w-full h-full py-2 bg-gray-700 text-white text-sm"
                                type="text"
                                value={selectedItems.join(", ") || "Filter by..."}
                                disabled={true}
                            />
                            <label
                                htmlFor="filter-control"
                                onClick={onFilterBy}
                                className="cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-white"/>
                            </label>
                        </div>

                        {selectedFilteredBy &&
                        <div
                            className="absolute top-full w-[200px] left-0 bg-white shadow-lg rounded z-10"
                            onMouseLeave={onFilterBy}
                        >

                            {/* Multi Select Items */}
                            <ul>
                                {thead.map((head, index) => (
                                    <li key={index} className="px-4 py-2 flex justify-between items-center">
                                        <span>{head}</span>
                                        <input
                                            type="checkbox"
                                            checked={isItemSelected(head)}
                                            onChange={() => onItemSelection(head)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>}
                    </div>
                </div>

                {/* Pagination Buttons */}
                <div className="order-2 space-x-4 flex justify-start">
                    <button
                        className="py-1 bg-gray-700 rounded text-white w-24 h-fit cursor-pointer hover:bg-gray-800"
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                    ><span className="text-xs sm:text-xs md:text-md">Previous</span></button>
                    <button
                        className="py-1 bg-gray-700 rounded text-white w-24 h-fit cursor-pointer hover:bg-gray-800"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                    ><span className="text-xs sm:text-xs md:text-md">Next</span></button>
                </div>
            </div>

            {/* Table Data */}
            <div className="w-full h-full overflow-auto">
                <table className="relative w-full text-sm">
                    <thead className="text-xs text-gray-900 uppercase">
                        <tr>
                            {thead.map((head, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-left">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index} className="text-gray-700">
                                {thead.map((head, index) => (
                                    <td key={index} className="px-6 py-4 text-left">
                                        {head === "User ID" ? (
                                            <div className="flex flex-row">
                                                <span>{row[head] as number}</span>
                                                <span
                                                    className="ml-4 text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={() => {
                                                        if (onUserIdClick) {
                                                            toggleUserIdOverlay();
                                                            onUserIdClick(row[head] as number);
                                                        }
                                                    }}
                                                >View / Edit</span>
                                            </div>
                                        ) : (
                                            row[head] instanceof Date ? row[head].toLocaleString() : row[head]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    {userIdOverlay &&
                        <Overlay onClose={toggleUserIdOverlay}>
                            <div className="mx-auto max-w-7xl bg-white rounded-md shadow p-4 h-fit">
                                {children}
                            </div>
                        </Overlay>
                    }
                </table>
            </div>

            <div className="w-full h-12 flex justify-start items-center space-x-4">
                <span className="font-bold">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    );
};

export default PaginatedTable;