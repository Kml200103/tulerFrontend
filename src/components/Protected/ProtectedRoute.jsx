import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const authenticate = () => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("userToken");
    return !!token; // Returns true if token exists, otherwise false
  };

  // If the user is not authenticated, redirect to the login page
  if (!authenticate()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
