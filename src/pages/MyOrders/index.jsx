import React, { useEffect, useState } from "react";
import { OrderDetailsCard } from "../../components/OrderDetailsCard";
import { get } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination";

const MyOrders = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const [groupedOrders, setGroupedOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  const getMyOrders = async () => {
    if (!userId) return;
    try {
      const response = await get(
        `/order/allOrders/${userId}?page=${currentPage}&pageSize=${itemsPerPage}`
      );
      const orders = response?.receiveObj?.orders || [];
      const pagination = response?.receiveObj?.pagination || {};

      // Set total orders for pagination
      setTotalOrders(pagination.totalOrders);

      // Group orders by addressId
      const grouped = orders.reduce((acc, order) => {
        const addressId = order.address._id;

        if (!acc[addressId]) {
          acc[addressId] = {
            address: order.address,
            orders: [],
          };
        }

        acc[addressId].orders.push(order);
        return acc;
      }, {});

      setGroupedOrders(grouped);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, [userId, currentPage, itemsPerPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const setPageSize = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex flex-col text-3xl font-semibold leading-[64px] max-w-full rounded-[30px] text-neutral-700">
      <h1 className="text-2xl font-bold mb-4 px-11 pt-7">All Orders</h1>
      <div className="px-11 pt-7 w-full bg-white pb-10 rounded-[30px] shadow-md max-md:px-5 max-md:pb-28">
        <div>
          {groupedOrders && Object.keys(groupedOrders).length > 0 ? (
            Object.entries(groupedOrders).map(([addressId, group]) => (
              <OrderDetailsCard key={addressId} group={group} />
            ))
          ) : (
            <p className="text-gray-600">No orders found.</p>
          )}
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination
        totalItems={totalOrders}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default MyOrders;
