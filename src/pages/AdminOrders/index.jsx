import { useEffect, useState } from "react";
import { Button, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ConfirmModal from "../../components/ConfirmModal";
import { EyeIcon, Pencil } from "lucide-react";
import Pagination from "../../components/Pagination";
import { get, post } from "../../services/http/axiosApi";

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleShow = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setEditableOrderId(null); // Reset editable order when closing dialog
  };

  const openConfirmModal = (order) => {
    setOrderToCancel(order);
    setIsConfirmModalOpen(true);
  };

  const handleCancelOrder = async () => {
    // Logic to cancel the order
    await cancelOrder(orderToCancel.orderId);
    setIsConfirmModalOpen(false);
    setOrderToCancel(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setOrderToCancel(null);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-purple-200 text-purple-600";
      case "CANCEL":
        return "bg-red-200 text-red-600";
      case "COMPLETED":
        return "bg-green-200 text-green-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };
  const choosePaymentColor = (status) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-400 text-white"; // Bright green for paid
      case "UNPAID":
        return "bg-red-400 text-white"; // Red for unpaid
      case "REFUNDED":
        return "bg-yellow-400 text-black"; // Yellow for refunded
      default:
        return "bg-gray-200 text-gray-600"; // Default gray for unknown status
    }
  };

  const getAdminOrders = async () => {
    try {
      const response = await get(
        `/order/all?page=${currentPage}&pageSize=${pageSize}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      const orders = response?.receiveObj?.orders || [];
      const pagination = response?.receiveObj?.pagination || {};

      // Set total orders for pagination
      setTotalOrders(pagination.totalOrders);
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const cancelOrder = async (orderId) => {
    const { receiveObj } = await post(
      "/order/status",
      {
        orderId: orderId,
        status: "CANCEL",
      },
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    if (receiveObj.status === true) {
      // Optionally refresh orders after cancellation
      getAdminOrders();
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const { receiveObj } = await post(
      "/order/status",
      {
        orderId: orderId,
        status: status,
      },
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    if (receiveObj.status === true) {
      // Update local orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: status } : order
        )
      );
      setEditableOrderId(null); // Reset editable order
    }
  };

  const handleStatusChange = (e, orderId) => {
    const selectedStatus = e.target.value;
    setNewStatus(selectedStatus);
    updateOrderStatus(orderId, selectedStatus);
  };

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  useEffect(() => {
    getAdminOrders();
  }, [currentPage, pageSize]);

  console.log("orders", orders);
  return (
    <div className="overflow-x-auto">
      <div className="bg-white flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-xl font-semibold">Admin Orders</h1>
            </div>

            {orders?.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No orders found.
              </div>
            ) : (
              <>
                {/* Desktop View - Full Table */}
                <div className="hidden md:block">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-2 text-left cursor-pointer">
                          Order#
                        </th>
                        <th className="py-3 px-2 text-left">Items</th>
                        <th className="py-3 px-2 text-center">Total</th>
                        <th className="py-3 px-2 text-center">Address</th>
                        <th className="py-3 px-2 text-center">Order Status</th>
                        <th className="py-3 px-2 text-center">Payment</th>
                        <th className="py-3 px-2 text-left">Order Time</th>
                        <th className="py-3 px-2 text-center">Actions</th>
                        <th className="py-3 px-2 text-center">Cancel</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {orders?.map((order) => (
                        <tr
                          key={order.orderId}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-2 text-left whitespace-nowrap">
                            <span className="font-medium">
                              {truncateText(order?.orderId, 8)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-left">
                            {order.items
                              .map(
                                (item) =>
                                  `${item?.productName} - ${item?.quantity}`
                              )
                              .join(", ")}
                          </td>
                          <td className="py-3 px-2 text-center">
                            ${order?.totalPrice}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {truncateText(
                              `${order?.address?.streetAddress}, ${order?.address?.city}, ${order?.address?.state}, ${order.address.country}, ${order.address.pincode}`,
                              30
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {editableOrderId === order?.orderId ? (
                              // Check if the order status is not CANCELLED or COMPLETED
                              order.status !== "CANCELLED" &&
                              order.status !== "COMPLETED" ? (
                                <select
                                  value={newStatus}
                                  onChange={(e) =>
                                    handleStatusChange(e, order.orderId)
                                  }
                                  className="text-sm p-1 border rounded"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              ) : (
                                <span
                                  className={`${chooseColor(
                                    order.status
                                  )} py-1 px-3 rounded-full text-xs`}
                                >
                                  {order.status.toUpperCase()}
                                </span>
                              )
                            ) : (
                              <span
                                className={`${chooseColor(
                                  order.status
                                )} py-1 px-3 rounded-full text-xs`}
                              >
                                {order.status.toUpperCase()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-xs ${choosePaymentColor(
                                order?.paymentStatus
                              )}`}
                            >
                              {order?.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3 px-2 text-left">
                            {new Date(order?.createdAt).toLocaleString()}
                          </td>

                          <td className="py-3 px-2 text-center flex items-center justify-center space-x-2">
                            <EyeIcon
                              className="w-6 h-6 cursor-pointer hover:text-purple-500"
                              onClick={() => handleShow(order)}
                            />
                            <Pencil
                              className={`w-6 h-6 cursor-pointer ${
                                order.status === "CANCEL"
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:text-purple-500"
                              }`}
                              onClick={() => {
                                if (editableOrderId === order.orderId) {
                                  // If the same order is clicked twice, cancel edit mode
                                  setEditableOrderId(null);
                                  setNewStatus(""); // Reset status
                                } else {
                                  setEditableOrderId(order.orderId);
                                  setNewStatus(order.status); // Set the current status for the dropdown
                                }
                              }}
                            />
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              className={`text-red-500 text-sm font-semibold rounded-md hover:underline transition ${
                                order.status === "CANCEL"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={order?.status === "CANCEL"}
                              onClick={() => openConfirmModal(order)}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="block md:hidden">
                  {orders?.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="font-bold text-gray-700">
                            Order #
                          </span>
                          <span className="font-medium ml-1">
                            {truncateText(order?.orderId, 8)}
                          </span>
                        </div>
                        <span className="text-gray-600 text-xs">
                          {new Date(order?.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="font-bold text-gray-700 text-sm block">
                            Status:
                          </span>
                          {editableOrderId === order?.orderId ? (
                            order.status !== "CANCELLED" &&
                            order.status !== "COMPLETED" ? (
                              <select
                                value={newStatus}
                                onChange={(e) =>
                                  handleStatusChange(e, order.orderId)
                                }
                                className="text-sm p-1 border rounded mt-1 w-full"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            ) : (
                              <span
                                className={`${chooseColor(
                                  order.status
                                )} py-1 px-2 rounded-full text-xs inline-block mt-1`}
                              >
                                {order.status.toUpperCase()}
                              </span>
                            )
                          ) : (
                            <span
                              className={`${chooseColor(
                                order.status
                              )} py-1 px-2 rounded-full text-xs inline-block mt-1`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-gray-700 text-sm block">
                            Payment:
                          </span>
                          <span
                            className={`py-1 px-2 rounded-full text-xs inline-block mt-1 ${choosePaymentColor(
                              order?.paymentStatus
                            )}`}
                          >
                            {order?.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="font-bold text-gray-700 text-sm block">
                          Items:
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items
                            .map(
                              (item) =>
                                `${item?.productName} - ${item?.quantity}`
                            )
                            .join(", ")}
                        </p>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-700 text-sm">
                            Total:
                          </span>
                          <span className="text-green-600 font-medium">
                            ${order?.totalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="font-bold text-gray-700 text-sm block">
                          Address:
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {truncateText(
                            `${order?.address?.streetAddress}, ${order?.address?.city}, ${order?.address?.state}, ${order.address.country}, ${order.address.pincode}`,
                            60
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between mt-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleShow(order)}
                            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                          >
                            <EyeIcon className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className={`bg-gray-100 p-2 rounded-full ${
                              order.status === "CANCEL"
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-gray-200"
                            }`}
                            onClick={() => {
                              if (editableOrderId === order.orderId) {
                                setEditableOrderId(null);
                                setNewStatus("");
                              } else {
                                setEditableOrderId(order.orderId);
                                setNewStatus(order.status);
                              }
                            }}
                          >
                            <Pencil className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        <button
                          className={`text-red-500 text-sm font-semibold rounded-md hover:underline transition ${
                            order.status === "CANCEL"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={order?.status === "CANCEL"}
                          onClick={() => openConfirmModal(order)}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Component */}
                <div className="px-4 py-3">
                  <Pagination
                    totalItems={totalOrders}
                    itemsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    setPageSize={setPageSize}
                    currentPage={currentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for showing order details */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="flex items-center justify-center fixed inset-0 z-50 p-4">
          <DialogPanel className="relative transform overflow-y-auto rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-3xl w-full max-h-[85vh]">
            <div className="bg-gray-50 px-4 py-6 sm:px-6">
              {selectedOrder && (
                <>
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Order Details</h1>
                    <button
                      onClick={handleCloseDialog}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none text-2xl p-2"
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                  <main className="flex flex-col gap-4 p-3 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <span className="font-semibold text-gray-700">
                          Order ID:
                        </span>
                        <span className="text-gray-600 font-bold ml-1">
                          {selectedOrder.orderId}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border rounded-lg p-3 sm:p-4 bg-white">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <h3
                            className={`px-2 py-1 rounded-full text-xs ${choosePaymentColor(
                              selectedOrder.paymentStatus
                            )}`}
                          >
                            {selectedOrder.paymentStatus.toUpperCase()}
                          </h3>

                          <h3
                            className={`px-2 py-1 rounded-full text-xs ${chooseColor(
                              selectedOrder.status.toUpperCase()
                            )}`}
                          >
                            {selectedOrder.status.toUpperCase()}
                          </h3>
                          <h3 className="text-green-600">
                            ${selectedOrder.totalPrice.toFixed(2)}
                          </h3>
                        </div>
                        <h4 className="text-gray-600 mt-2 text-xs">
                          Order Time:{" "}
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </h4>
                      </div>
                      <div className="flex flex-col gap-3 mt-2">
                        {selectedOrder.items.map((item, index) => (
                          <div className="flex gap-2 items-center" key={index}>
                            <img
                              className="h-10 w-10 rounded-lg"
                              src={item.image}
                              alt="Product Image"
                            />
                            <div>
                              <h1>{item.productName}</h1>
                              <h1 className="text-gray-500 text-xs">
                                ${item.price} <span>X</span>{" "}
                                <span>{item.quantity}</span>
                              </h1>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h1 className="text-xl font-semibold">Address</h1>
                    <div className="flex flex-col gap-2 border rounded-lg p-3 sm:p-4 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            Full Name:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.name}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            Street:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.streetAddress}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            City:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.city}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            State:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.state}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            Country:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.country}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-medium text-gray-700 mr-2 min-w-24">
                            Pincode:
                          </span>
                          <span className="text-gray-600">
                            {selectedOrder.address.pincode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </main>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleCancelOrder}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this order?"
      />
    </div>
  );
};

export default AdminOrders;
