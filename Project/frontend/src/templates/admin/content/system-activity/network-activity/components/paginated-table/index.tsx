import React, { useEffect, useState } from "react";
import { FilterByProps, ReactChildProp, SearchBarProps, TableData } from "../../../../../../../common/interfaces";
import Searchbar from "../../../../../../../components/searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import Overlay from "../../../../../../../components/overlay";
import { Scrollbar } from "../../../../../../../components/scrollbar";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface PaginatedTableEventProps {
    onNextPageEvent: () => void;
    onPreviousPageEvent: () => void;
    disableNextLastPage?: boolean;
    disablePreviousFirstPage?: boolean;

}

const PaginatedTable: React.FC<TableData & ReactChildProp & SearchBarProps & FilterByProps & PaginatedTableEventProps> = ({
    thead,
    tbody,
    maxRowsPerPage,
    children,
    placeHolder,
    onCloseValue,
    onClose,
    onUserIdClick,
    onNextPageEvent,
    onPreviousPageEvent,
    disableNextLastPage,
    disablePreviousFirstPage
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilteredBy, setSelectedFilteredBy] = useState<boolean>(false);
    const [selectedItems, setSelectedFilterItems] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState(tbody);
    const [selectedColumn, setSelectedColumn] = useState<string>(" ");
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const rowsPerPage = maxRowsPerPage ? maxRowsPerPage : 10;
    const startingIndex = (currentPage - 1) * rowsPerPage;
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice(startingIndex, startingIndex + rowsPerPage);

    useEffect(() => {
        if (selectedColumn) {
            const uniqueValues = Array.from(
                new Set(tbody.map((row) => row[selectedColumn]?.toString().toLowerCase() || ""))
            );
            setFilterOptions(uniqueValues);
        }
    }, [selectedColumn, tbody]);

    function onNextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            onNextPageEvent();
        } else if (!disableNextLastPage) {
            onNextPageEvent();
        }
    }

    function onPreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            onPreviousPageEvent();
        } else if (!disablePreviousFirstPage) {
            onPreviousPageEvent();
        }
    }

    function onFilterBy() {
        setSelectedFilteredBy(!selectedFilteredBy);
    }

    function applyFilter(filterItems: string[], query: string, columnName?: string) {
        let filtered = tbody;

        // Apply search query filtering
        if (query.trim() !== "") {
            filtered = filtered.filter((row) =>
                Object.entries(row).some(
                    ([key, value]) =>
                        (!columnName || key === columnName) &&
                        value?.toString().toLowerCase().includes(query.toLowerCase())
                )
            );
        }

        // Apply column-based filtering
        if (filterItems.length > 0 && columnName) {
            filtered = filtered.filter((row) =>
                filterItems.includes((row[columnName]?.toString() ?? "").toLowerCase())
            );
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    }

    function onItemFilterSelection(item: string, columnName: string) {
        if (selectedItems.includes(item)) {
            const updatedItems = selectedItems.filter((item_) => item_ !== item);
            setSelectedFilterItems(updatedItems);
            applyFilter(updatedItems, searchQuery, columnName);
        } else {
            const updatedItems = [...selectedItems, item];
            setSelectedFilterItems(updatedItems);
            applyFilter(updatedItems, searchQuery, columnName);
        }
    }

    function isFilterItemSelected(item: string) {
        return selectedItems.includes(item);
    }

    function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value;
        setSearchQuery(query);
        applyFilter(selectedItems, query);
    }

    function resetFilterOptions() {
        setSelectedFilterItems([]);
        setSearchQuery("");
        setFilteredData(tbody);
        setCurrentPage(1);
        setSelectedFilteredBy(false);
        setSelectedColumn(" ");
    }

    useEffect(() => {
        setFilteredData(tbody);
    }, [tbody]);

    return (
        <div className="w-full h-fit bg-gray-200 rounded shadow-md p-4 grid grid-rows-[auto_1fr_auto grid-cols-1 gap-4">
            <div className="w-full h-fit flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="order-1 w-full md:w-fit relative w-1/2 grid grid-cols-2 gap-4">
                    <Searchbar
                        placeholder={placeHolder}
                        onSearchChange={(e) => {
                            onSearchChange({ target: { value: e } } as React.ChangeEvent<HTMLInputElement>);
                            setSearchQuery(e);
                            applyFilter(selectedItems, e);
                        }}
                    />

                    {/* Filtering Options */}
                    <div className="relative h-full w-fit flex justify-center items-center space-x-4 flex-col md:flex-row">
                        <div className="hidden md:block flex justify-end">
                            <div
                                className="relative bg-red-400 w-[120px] hover:bg-red-500 flex justify-center items-center rounded space-x-4 cursor-pointer px-2"
                                onClick={resetFilterOptions}
                            >
                                <input
                                    id="filter-contasdasd"
                                    className="w-full h-full py-2 text-white text-sm cursor-pointer"
                                    type="text"
                                    value="Reset Filter"
                                    disabled={true}
                                />
                                <label
                                    htmlFor="filter-controlasd"
                                    className="cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="text-white" />
                                </label>
                            </div>
                        </div>

                        <div className="relative">

                        <div
                            className="relative bg-gray-700 w-[200px] flex justify-center items-center rounded space-x-4 cursor-pointer px-2"
                            onClick={onFilterBy}
                        >
                            <input
                                id="filter-control"
                                className="w-full h-full py-2 bg-gray-700 text-white text-sm"
                                type="text"
                                value={selectedColumn !== " " ? selectedColumn.toString() + ": " + selectedItems.join(", ") : "Filter by..."}
                                disabled={true}
                            />
                            <label
                                htmlFor="filter-control"
                                onClick={onFilterBy}
                                className="cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-white" />
                            </label>
                        </div>

                        {selectedFilteredBy && filterOptions && filterOptions.length > 0 && (
                            <div
                                className="absolute top-full w-fit max-w-[300px] left-0 bg-white shadow-lg rounded z-10"
                                onMouseLeave={onFilterBy}
                            >
                                <Scrollbar>
                                    {/* Column Selection Dropdown */}
                                    <div className="max-h-96">
                                        <div className="w-full">
                                            <label htmlFor="column-select" className="text-red-500 text-left font-bold">Filter by column:</label>
                                            <select
                                                id="column-select"
                                                className="px-2 py-1 border rounded"
                                                value={selectedColumn}
                                                onChange={(e) => setSelectedColumn(e.target.value)}
                                            >
                                                <option value="" disabled>Select a column</option>
                                                {thead.map((column, index) => (
                                                    <option key={index} value={column}>
                                                        {column}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Multi Select Items */}
                                        <div className="mt-4">
                                            <ul>
                                                <label className="text-red-500 text-left font-bold">Column Options</label>
                                                {filterOptions.map((option, index) => (
                                                    <li key={index} className="px-4 py-2 flex justify-between items-center">
                                                        <span className="text-left">{option}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={isFilterItemSelected(option)}
                                                            onChange={() => onItemFilterSelection(option, selectedColumn)} // Use a dynamic column name
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Scrollbar>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Pagination Buttons */}
                <div className="order-2 space-x-4 flex justify-start pr-2">
                    <button
                        className="py-1 bg-gray-700 rounded text-white w-24 h-fit cursor-pointer hover:bg-gray-800"
                        onClick={onPreviousPage}
                        disabled={disablePreviousFirstPage ? currentPage === 1 : false}
                    >
                        <span className="text-xs sm:text-xs md:text-md">Previous</span>
                    </button>
                    <button
                        className="py-1 bg-gray-700 rounded text-white w-24 h-fit cursor-pointer hover:bg-gray-800"
                        onClick={onNextPage}
                        disabled={disableNextLastPage ? currentPage === totalPages : false}
                    >
                        <span className="text-xs sm:text-xs md:text-md">Next</span>
                    </button>

                    {/* Reset Filter Button */}
                    <div className="md:hidden w-full flex justify-end">
                        <div
                            className="relative bg-red-400 w-[120px] hover:bg-red-500 flex justify-center items-center rounded space-x-4 cursor-pointer px-2"
                            onClick={resetFilterOptions}
                        >
                            <input
                                id="filter-contasd"
                                className="w-full h-full py-2 text-white text-sm cursor-pointer"
                                type="text"
                                value="Reset Filter"
                                disabled={true}
                            />
                            <label
                                htmlFor="filter-controlasd"
                                className="cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-white" />
                            </label>
                        </div>
                    </div>
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
                            <tr
                                key={index}
                                className={`text-gray-700 cursor-pointer hover:bg-gray-300`}
                            >
                                {thead.map((head, index) => (
                                    <td key={index} className="px-6 py-4 text-left">
                                        {head === "User ID" ||
                                         head === "user_id" ||
                                         head === "userId" ? (
                                            <div className="flex flex-row">
                                                <span>{row[head] as number}</span>
                                                <span
                                                    className="ml-4 text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={() => {
                                                        if (onUserIdClick) {
                                                            onClose();
                                                            onUserIdClick(row[head] as number);
                                                        }
                                                    }}
                                                >View / Edit</span>
                                            </div>
                                        ) : (
                                            row[head] instanceof Date ? (
                                                new Date(row[head]).toLocaleDateString()
                                            ) : (
                                                row[head]
                                            )
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    {onCloseValue &&
                        <Overlay onClose={onClose} className="max-w-lg">
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