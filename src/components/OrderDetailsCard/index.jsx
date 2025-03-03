import React, { useState } from "react";
import { post } from "../../services/http/axiosApi";
import ConfirmModal from "../ConfirmModal";

export const OrderDetailsCard = ({ group }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  if (!group || !group.orders?.length)
    return <p className="text-gray-600">No orders found.</p>;

  const cancelOrder = async () => {
    if (!selectedOrderId) return;
    const { receiveObj } = await post("/order/status", {
      orderId: selectedOrderId,
      status: "CANCEL",
    });

    if (receiveObj.status === true) {
      setOpenModal(false); // Close modal after successful cancellation
      setSelectedOrderId(null); // Reset selected order
    }
  };

  return (
    <div className="mb-6 xs:mb-8 sm:mb-10 border p-3 xs:p-4 sm:p-5 rounded-md">
      {/* Orders */}
      {group?.orders.map((order) => (
        <div
          key={order.orderId}
          className="mt-3 xs:mt-4 sm:mt-5 border-t pt-3 xs:pt-4 sm:pt-5"
        >
          {/* Shipping Address */}
          <h2 className="text-base xs:text-lg font-bold">Shipping Address:</h2>
          <p className="text-xs xs:text-sm">
            {group.address?.name}, {group.address?.streetAddress},{" "}
            {group.address?.city}, {group.address?.state},{" "}
            {group.address?.country}, {group.address?.pincode}
          </p>

          {/* Order ID */}
          <h3 className="text-sm xs:text-md font-bold mt-3 xs:mt-4">
            Order ID: #{order.orderId}
          </h3>

          {/* Payment Status & Delivery Status */}
          <DeliveryStatus
            status={order.status}
            paymentStatus={order.paymentStatus}
            date={new Date(order.createdAt).toDateString()}
          />

          {/* Order Items */}
          {order.items.map((item) => (
            <OrderItem
              key={item.variantId}
              imageSrc={item.image}
              name={item.productName}
              description={`Weight: ${item.variantDetails?.weight}`}
              price={item.price}
              quantity={item.quantity}
            />
          ))}

          {/* Total Price */}
          <div className="mt-2 flex justify-between text-sm xs:text-md font-semibold text-gray-700">
            <span>Total Price:</span>
            <span>${order.totalPrice}</span>
          </div>

          {order.status === "PENDING" && (
            <button
              className="mt-3 xs:mt-4 text-red-500 text-xs xs:text-sm font-semibold rounded-md hover:underline transition"
              onClick={() => {
                setSelectedOrderId(order.orderId); // Set selected order
                setOpenModal(true); // Open confirmation modal
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={cancelOrder}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
      />
    </div>
  );
};

const DeliveryStatus = ({ status, paymentStatus, date }) => (
  <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 items-start xs:items-center my-2 xs:my-3 sm:my-4">
    <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-neutral-900">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6500e83bdfb007dcd195b7f2923d015c9e9cf3241607f413c280539c95dd9b2a"
        alt="Delivery Icon"
        className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
      />
    </div>
    <div className="text-xs xs:text-sm sm:text-base font-semibold">
      <span
        className={`text-${
          status === "PENDING"
            ? "yellow-400"
            : status === "COMPLETED"
            ? "green-500"
            : "red-500"
        }`}
      >
        Delivery Status:{" "}
        {status === "PENDING"
          ? "Pending"
          : status === "COMPLETED"
          ? "Completed"
          : "Cancelled"}
      </span>
      <br />
      <span className="text-xs xs:text-sm text-gray-600">{date}</span>
      <br />
      <span
        className={`text-${paymentStatus === "PAID" ? "green-500" : "red-500"}`}
      >
        Payment Status: {paymentStatus}
      </span>
    </div>
  </div>
);

const OrderItem = ({ imageSrc, name, description, price, quantity }) => (
  <div className="flex items-start gap-3 xs:gap-4 sm:gap-5 mt-2 xs:mt-3 border p-2 xs:p-3 rounded-md">
    <img
      src={imageSrc}
      alt={name}
      className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 rounded-md object-cover"
    />
    <div>
      <h3 className="text-base xs:text-lg font-bold">{name}</h3>
      <p className="text-xs xs:text-sm text-gray-600">{description}</p>
      <p className="text-xs xs:text-sm">Quantity: {quantity}</p>
      <p className="text-xs xs:text-sm font-semibold">
        Price: ${price * quantity}
      </p>
    </div>
  </div>
);
