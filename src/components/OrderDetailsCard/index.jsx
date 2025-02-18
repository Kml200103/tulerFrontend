import React from "react";
import { post } from "../../services/http/axiosApi";

export const OrderDetailsCard = ({ group }) => {
  if (!group || !group.orders?.length)
    return <p className="text-gray-600">No orders found.</p>;

  const cancelOrder = async (orderId) => {
    const { receiveObj } = await post("/order/status", {
      orderId: orderId,
      status: "CANCEL",
    });
    if (receiveObj.status == true) {
    }
  };

  return (
    <div className="mb-10 border p-5 rounded-md">
      {/* Orders */}
      {group.orders.map((order) => (
        <div key={order.orderId} className="mt-5 border-t pt-5">
          {/* Shipping Address */}
          <h2 className="text-lg font-bold">Shipping Address:</h2>
          <p className="text-sm">
            {group.address?.name}, {group.address?.streetAddress},{" "}
            {group.address?.city}, {group.address?.state},{" "}
            {group.address?.country}, {group.address?.pincode}
          </p>

          {/* Order ID */}
          <h3 className="text-md font-bold mt-4">Order ID: #{order.orderId}</h3>

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
              imageSrc={item.image[0]}
              name={item.productName}
              description={`Weight: ${item.variantDetails?.weight}`}
              price={item.price}
              quantity={item.quantity}
            />
          ))}

          {/* Total Price */}
          <div className="mt-2 flex justify-between text-md font-semibold text-gray-700">
            <span>Total Price:</span>
            <span>${order.totalPrice}</span>
          </div>

          {order.status == "PENDING" && (
            <button
              className="mt-4 text-red-500 text-sm font-semibold rounded-md hover:underline transition"
              onClick={() => cancelOrder(order.orderId)}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const DeliveryStatus = ({ status, paymentStatus, date }) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-900">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6500e83bdfb007dcd195b7f2923d015c9e9cf3241607f413c280539c95dd9b2a"
        alt="Delivery Icon"
        className="w-12 h-12"
      />
    </div>
    <div className="text-sm sm:text-lg font-semibold">
      <span
        className={`text-${
          status === "PENDING"
            ? "yellow-400"
            : status === "COMPLETED"
            ? "green-500"
            : "red-500"
        } text-md`}
      >
        Delivery Status:{" "}
        {status === "PENDING"
          ? "Pending"
          : status === "COMPLETED"
          ? "Completed"
          : "Cancelled"}
      </span>
      <br />
      <span className="text-sm text-gray-600 ">{date}</span>
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
  <div className="flex items-start gap-5 mt-3 border p-3 rounded-md">
    <img src={imageSrc} alt={name} className="w-20 h-20 rounded-md" />
    <div>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm">Quantity: {quantity}</p>
      <p className="text-sm font-semibold">Price: ${price * quantity}</p>
    </div>
  </div>
);
