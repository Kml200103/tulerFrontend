import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { get } from "../../services/http/axiosApi"; // Ensure you have this API function

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const orderId = queryParams.get("order_id");
  console.log(orderId);

  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Redirect user if session_id is missing
  useEffect(() => {
    if (!sessionId) {
      navigate("/"); // Redirect to home or any other page
    } else {
      getSessionStatus();
    }
  }, [sessionId, navigate]);

  // Fetch session details
  const getSessionStatus = async () => {
    try {
      const { receiveObj } = await get(`/order/checkSession/${sessionId}`);

      if (receiveObj.success) {
        setOrderDetails(receiveObj);
        setPaymentFailed(false); // Ensure success message is shown
      } else {
        setPaymentFailed(true);
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      setPaymentFailed(true);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        paymentFailed ? "bg-red-50" : "bg-green-50"
      } p-6 text-center`}
    >
      {paymentFailed ? (
        <>
          <XCircleIcon className="w-24 h-24 text-red-500 mb-4" />
          <h2 className="text-3xl font-semibold text-red-700">
            Payment Transaction Not Completed
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Your payment was not successful. If the amount was deducted, please
            contact support.
          </p>
        </>
      ) : (
        <>
          <CheckCircleIcon className="w-24 h-24 text-green-500 mb-4" />
          <h2 className="text-3xl font-semibold text-green-700">
            Payment Successful!
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>

          {orderId && (
            <p className="text-lg font-semibold text-gray-800 mt-2">
              Order ID: <span className="text-blue-600">#{orderId}</span>
            </p>
          )}
        </>
      )}

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6   text-blue-600 text-lg font-semibold  hover:underline transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
