import React from "react";
import { useLocation, useNavigate } from "react-router";

const SuccessOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A"; // Fallback if not found
  const handleGoToOrders = () => {
    navigate("/my-orders");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-center text-gray-700 mb-6">
        Your order has been successfully placed. We appreciate your business!
      </p>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Order ID:</h2>
        <p className="text-xl text-blue-600">#{orderId}</p>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          You will receive a confirmation email shortly.
        </p>
        <p className="text-gray-600">
          If you have any questions, feel free to contact our support team.
        </p>
      </div>
      <button
        onClick={handleGoToOrders}
        className="mt-4 text-blue-600  focus:outline-none hover:underline"
      >
        Go to My Orders
      </button>
    </div>
  );
};

export default SuccessOrderPage;
