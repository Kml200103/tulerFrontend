import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-4xl mx-auto relative"
        style={{
          minHeight: "min(80vh, 600px)",
          maxHeight: "90vh",
          overflow: "auto",
          width: "95%",
        }}
      >
        {/* Close icon in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Decorative crescent moon icon */}
        <div className="flex justify-center mb-6 md:mb-8 lg:mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-20 md:h-20 lg:w-24 lg:h-24"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-center text-indigo-700">
          Ramadan Mubarak!
        </h2>

        <p className="mb-6 md:mb-8 text-xl md:text-2xl text-center text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Wishing you a blessed and joyful Ramadan filled with peace, happiness,
          and spiritual growth.
        </p>

        <div className="text-center text-lg md:text-xl text-gray-600 italic max-w-2xl mx-auto">
          May this holy month bring you and your loved ones abundant blessings.
        </div>

        {/* Decorative border */}
        <div className="mt-8 md:mt-12 lg:mt-16 pt-6 border-t border-gray-200 flex justify-center">
          <div className="w-24 md:w-32 lg:w-40 h-1 md:h-2 bg-indigo-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
