import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  setPageSize,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages based on items per page

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }).map((_, index) => (
      <div
        key={index}
        onClick={() => handleClick(index + 1)}
        aria-current="page"
        className={`relative cursor-pointer z-10 inline-flex items-center ${
          index + 1 === currentPage
            ? "bg-indigo-600 text-white"
            : "text-gray-400"
        } px-2 py-1 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
      >
        {index + 1}
      </div>
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between items-center sm:hidden">
        <div
          onClick={() => handleClick(currentPage - 1)}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Add this to display page numbers */}
        <div className="flex justify-center ml">{renderPageNumbers()}</div>

        <div
          onClick={() => handleClick(currentPage + 1)}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {currentPage * itemsPerPage > totalItems
                ? totalItems
                : currentPage * itemsPerPage}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex items-center -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={() => handleClick(currentPage - 1)}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>

            {/* Render Page Numbers Here */}
            {renderPageNumbers()}

            <div
              onClick={() => handleClick(currentPage + 1)}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
      <div className="flex items-center mt-2 sm:mt-0">
        <select
          value={itemsPerPage}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-4 px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
