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

  const userRole = getUserRole();
  const currentPath = window.location.pathname;

  // If the user is not authenticated, redirect to the login page
  if (!authenticate()) {
    return <Navigate to="/login" replace />;
  }

  // Restricted routes based on user role
  const buyerRestrictedRoutes = [
    "/all-products",
    "/add-product",
    "/adminProfile",
    "/all-orders",
  ];
  const adminRestrictedRoutes = ["/", "/products", "/profile", "/checkout"];

  if (userRole === "buyer" && buyerRestrictedRoutes.includes(currentPath)) {
    return <Navigate to="/" replace />; // Redirect buyer to home
  }

  if (userRole === "admin" && adminRestrictedRoutes.includes(currentPath)) {
    return <Navigate to="/adminProfile" replace />; // Redirect admin to admin profile
  }

  // If authenticated and not restricted, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
