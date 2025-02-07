// components/Loader.js
import React from "react";
import { useSelector } from "react-redux";

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading); // Adjust based on your state

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-left-color: #3b82f6; /* Change this to your desired color */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
