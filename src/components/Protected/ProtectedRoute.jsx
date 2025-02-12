import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const authenticate = () => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("userToken");
    return !!token; // Returns true if token exists, otherwise false
  };

  const getUserRole = () => {
    // Assuming the user role is stored in localStorage
    const userRole = localStorage.getItem("userRole");
    return userRole; // Returns the user role (e.g., "buyer", "admin")
  };

  const isBuyer = getUserRole() === "buyer";

  // If the user is not authenticated, redirect to the login page
  if (!authenticate()) {
    return <Navigate to="/login" replace />;
  }

  // If the user is a buyer, restrict access to certain routes
  const restrictedRoutes = ["/all-products", "/add-product"];
  const currentPath = window.location.pathname;

  if (isBuyer && restrictedRoutes.includes(currentPath)) {
    return <Navigate to="/" replace />; // Redirect to home or another page
  }

  // If authenticated and not restricted, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
