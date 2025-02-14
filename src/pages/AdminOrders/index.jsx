import { useState } from "react";
import { Button, Dialog, DialogBackdrop } from "@headlessui/react";
import ConfirmModal from "../../components/ConfirmModal";
import { EyeIcon, Pencil } from "lucide-react";
import Pagination from "../../components/Pagination";

const staticOrders = [
  {
    orderId: "ORD123456",
    items: [
      { name: "Product 1", productQuantity: 2 },
      { name: "Product 2", productQuantity: 1 },
    ],
    grandTotal: 50.0,
    address: {
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
    status: "pending",
    paymentStatus: "paid",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z",
  },
  {
    orderId: "ORD123457",
    items: [
      { name: "Product 3", productQuantity: 1 },
      { name: "Product 4", productQuantity: 3 },
    ],
    grandTotal: 75.0,
    address: {
      streetAddress: "456 Elm St",
      city: "Othertown",
      state: "NY",
      zipCode: "67890",
    },
    status: "dispatched",
    paymentStatus: "unpaid",
    createdAt: "2023-10-02T12:00:00Z",
    updatedAt: "2023-10-02T12:00:00Z",
  },
  // Add more static orders as needed
];

function AdminOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const totalPages = Math.ceil(staticOrders.length / pageSize);

  const handleShow = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const openConfirmModal = (order) => {
    setOrderToCancel(order);
    setIsConfirmModalOpen(true);
  };

  const handleCancelOrder = () => {
    // Logic to cancel the order
    setIsConfirmModalOpen(false);
    setOrderToCancel(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setOrderToCancel(null);
  };

  return (
    <div className="overflow-x-auto ">
      <div className="bg-white flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full max-w-7xl">
          <div className="bg-white shadow-md rounded my-6">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-xl font-semibold">Admin Orders</h1>
            </div>

            {staticOrders.length === 0 ? (
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
                      <th className="py-3 px-0 text-left">Last Updated</th>
                      <th className="py-3 px-0 text-center">Actions</th>
                      <th className="py-3 px-0 text-center">Cancel</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {staticOrders
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((order) => (
                        <tr
                          key={order.orderId}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-0 text-left whitespace-nowrap">
                            <span className="font-medium">{order.orderId}</span>
                          </td>
                          <td className="py-3 px-0 text-left">
                            {order.items
                              .map(
                                (item) =>
                                  `${item.name} - ${item.productQuantity}`
                              )
                              .join(", ")}
                          </td>
                          <td className="py-3 px-0 text-center">
                            ${order.grandTotal}
                          </td>
                          <td className="py-3 px-0 text-center">
                            {`${order.address.streetAddress}, ${order.address.city}`}
                          </td>
                          <td className="py-3 px-0 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-xs ${
                                order.status === "pending"
                                  ? "bg-purple-200 text-purple-600"
                                  : "bg-green-200 text-green-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-0 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-xs ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-200 text-green-600"
                                  : "bg-red-200 text-red-600"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-0 text-left">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {new Date(order.updatedAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-0 text-center space-x-2">
                            <EyeIcon
                              className="w-8 h-8 cursor-pointer hover:text-purple-500"
                              onClick={() => handleShow(order)}
                            />
                            <Pencil className="w-8 h-8 cursor-pointer hover:text-purple-500" />
                          </td>
                          <td className="py-3 px-0 text-center">
                            <button
                              onClick={() => openConfirmModal(order)}
                              className="ml-8"
                            >
                              <img
                                src="/images/multiply.png"
                                alt="cancel"
                                width={20}
                                height={20}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Pagination Component */}
                <Pagination
                  totalItems={staticOrders.length}
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
          <Dialog.Panel className="relative transform overflow-y-auto rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-3xl w-full max-h-[85vh]">
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
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedOrder.paymentStatus === "paid"
                                ? "bg-green-200 text-green-600"
                                : "bg-red-200 text-red-600"
                            }`}
                          >
                            {selectedOrder.paymentStatus.toUpperCase()}
                          </h3>
                          <h3
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedOrder.status === "pending"
                                ? "bg-purple-200 text-purple-600"
                                : "bg-green-200 text-green-600"
                            }`}
                          >
                            {selectedOrder.status.toUpperCase()}
                          </h3>
                          <h3 className="text-green-600">
                            ${selectedOrder.grandTotal.toFixed(2)}
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
                              src="/images/product-placeholder.png"
                              alt="Product Image"
                            />
                            <div>
                              <h1>{item.name}</h1>
                              <h1 className="text-gray-500 text-xs">
                                ${item.price} <span>X</span>{" "}
                                <span>{item.productQuantity}</span>
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
                            <td>{selectedOrder.user?.name || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Mobile</td>
                            <td>{selectedOrder.user?.phoneNumber || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>{selectedOrder.user?.email || "N/A"}</td>
                          </tr>
                          <tr>
                            <td>Street Address</td>
                            <td>{selectedOrder.address?.streetAddress}</td>
                          </tr>
                          <tr>
                            <td>City</td>
                            <td>{selectedOrder.address?.city}</td>
                          </tr>
                          <tr>
                            <td>State</td>
                            <td>{selectedOrder.address?.state}</td>
                          </tr>
                          <tr>
                            <td>Pincode</td>
                            <td>{selectedOrder.address?.zipCode}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </main>
                </>
              )}
            </div>
          </Dialog.Panel>
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
}

export default AdminOrders;
