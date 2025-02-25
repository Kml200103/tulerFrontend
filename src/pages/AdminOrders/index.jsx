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
        `/order/all?page=${currentPage}&pageSize=${pageSize}`
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
    const { receiveObj } = await post("/order/status", {
      orderId: orderId,
      status: "CANCEL",
    });
    if (receiveObj.status === true) {
      // Optionally refresh orders after cancellation
      getAdminOrders();
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const { receiveObj } = await post("/order/status", {
      orderId: orderId,
      status: status,
    });
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
    <div className="overflow-x-auto ">
      <div className="bg-white flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full max-w-7xl">
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
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-0 text-left cursor-pointer">
                        Order#
                      </th>
                      <th className="py-3 px-0 text-left">Items</th>
                      <th className="py-3 px-0 text-center">Total Amount</th>
                      <th className="py-3 px-0 text-center">
                        Shipping Address
                      </th>
                      <th className="py-3 px-0 text-center">Order Status</th>
                      <th className="py-3 px-0 text-center">Payment Status</th>
                      <th className="py-3 px-0 text-left">Order Time</th>
                      <th className="py-3 px-0 text-center">Actions</th>
                      <th className="py-3 px-0 text-center">Cancel</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {orders?.map((order) => (
                      <tr
                        key={order.orderId}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-0 text-left whitespace-nowrap">
                          <span className="font-medium">
                            {truncateText(order?.orderId, 8)}
                          </span>
                        </td>
                        <td className="py-3 px-0 text-left">
                          {order.items
                            .map(
                              (item) =>
                                `${item?.productName} - ${item?.quantity}`
                            )
                            .join(", ")}
                        </td>
                        <td className="py-3 px-0 text-center">
                          ${order?.totalPrice}
                        </td>
                        <td className="py-3 px-0 text-center">
                          {truncateText(
                            `${order?.address?.streetAddress}, ${order?.address?.city}, ${order?.address?.state}, ${order.address.country}, ${order.address.pincode}`,
                            30
                          )}
                        </td>
                        <td className="py-3 px-0 text-center">
                          {editableOrderId === order?.orderId ? (
                            // Check if the order status is not CANCELLED or COMPLETED
                            order.status !== "CANCELLED" &&
                            order.status !== "COMPLETED" ? (
                              <select
                                value={newStatus}
                                onChange={(e) =>
                                  handleStatusChange(e, order.orderId)
                                }
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                {/* <option value="CANCELLED">CANCELLED</option> */}
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
                        <td className="py-3 px-0 text-center">
                          <span
                            className={`py-1 px-3 rounded-full text-xs ${choosePaymentColor(
                              order?.paymentStatus
                            )}`}
                          >
                            {order?.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3 px-0 text-left">
                          {new Date(order?.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3 px-0 text-center flex items-center justify-center space-x-2">
                          <EyeIcon
                            className="w-8 h-8 cursor-pointer hover:text-purple-500"
                            onClick={() => handleShow(order)}
                          />
                          <Pencil
                            className={`w-8 h-8 cursor-pointer ${
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
                        <td className="py-3 px-0 text-center">
                          <td className="py-3 px-0 text-center">
                            <button
                              className={`mt-4 text-red-500 text-sm font-semibold rounded-md hover:underline transition ${
                                order.status === "CANCEL"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={order?.status === "CANCEL"}
                              onClick={() => openConfirmModal(order)}
                            >
                              Cancel Order
                            </button>
                          </td>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Component */}
                <Pagination
                  totalItems={totalOrders}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  setPageSize={setPageSize}
                  currentPage={currentPage}
                />
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
        <div className="flex items-center justify-center fixed inset-0 z-50">
          <DialogPanel className="relative transform overflow-y-auto rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-3xl w-full max-h-[85vh]">
            <div className="bg-gray-50 px-6 py-8 sm:px-10">
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
                  <main className="flex flex-col gap-4 p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700">
                          Order ID:
                        </span>
                        <span className="text-gray-600 font-bold ml-1">
                          {selectedOrder.orderId}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                          <h3
                            className={`px-2 py-1 rounded-full text-xs ${choosePaymentColor(
                              selectedOrder.paymentStatus
                            )}`}
                          >
                            {selectedOrder.paymentStatus.toUpperCase()}
                          </h3>

                          <h3
                            className={`px-2 py-1 rounded-full text-xs ${chooseColor(
                              selectedOrder.status.toUpperCase() // Remove the curly braces
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
                    <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
                      <table>
                        <tbody>
                          <tr>
                            <td>Full Name</td>
                            <td>{selectedOrder.address.name}</td>
                          </tr>
                          <tr>
                            <td>Street Address</td>
                            <td>{selectedOrder.address.streetAddress}</td>
                          </tr>
                          <tr>
                            <td>City</td>
                            <td>{selectedOrder.address.city}</td>
                          </tr>
                          <tr>
                            <td>State</td>
                            <td>{selectedOrder.address.state}</td>
                          </tr>
                          <tr>
                            <td>Country</td>
                            <td>{selectedOrder.address.country}</td>
                          </tr>
                          <tr>
                            <td>Pincode</td>
                            <td>{selectedOrder.address.pincode}</td>
                          </tr>
                        </tbody>
                      </table>
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
