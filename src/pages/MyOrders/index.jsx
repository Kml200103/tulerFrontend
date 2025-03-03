import React, { useEffect, useState, useMemo, useCallback } from "react";
import { OrderDetailsCard } from "../../components/OrderDetailsCard";
import { get } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination";

const MyOrders = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const [ordersData, setOrdersData] = useState({
    orders: {},
    totalOrders: 0,
    loading: true,
    error: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const getMyOrders = useCallback(async () => {
    if (!userId) {
      setOrdersData({
        orders: {},
        totalOrders: 0,
        loading: false,
        error: null,
      });
      return;
    }
    setOrdersData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await get(
        `/order/allOrders/${userId}?page=${currentPage}&pageSize=${itemsPerPage}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );

      if (!response.receiveObj?.status) {
        setOrdersData({
          orders: {},
          totalOrders: 0,
          loading: false,
          error: null,
        });
        return;
      }

      const orders = response.receiveObj.orders || [];
      console.log(orders);

      const totalOrders = response.receiveObj.pagination?.totalOrders || 0;

      const grouped = orders.reduce((acc, order) => {
        const addressId = order.address?._id || "unknown";
        if (!acc[addressId]) {
          acc[addressId] = {
            address: order.address || "Address not available",
            orders: [],
          };
        }
        acc[addressId].orders.push(order);
        return acc;
      }, {});

      setOrdersData({
        orders: grouped,
        totalOrders,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersData({
        orders: {},
        totalOrders: 0,
        loading: false,
        error: "Failed to fetch orders.",
      });
    }
  }, [userId, currentPage, itemsPerPage]);

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const setPageSize = useCallback((size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const orderKeys = useMemo(
    () => Object.keys(ordersData.orders),
    [ordersData.orders]
  );

  return (
    <div className="flex flex-col text-3xl font-semibold leading-[64px] max-w-full rounded-[30px] text-neutral-700">
      <h1 className="text-2xl font-bold mb-4 px-11 pt-7">All Orders</h1>
      <div className="px-11 pt-7 w-full bg-white pb-10 rounded-[30px] shadow-md max-md:px-5 max-md:pb-28">
        <div>
          {ordersData.loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Loading orders...</p>
            </div>
          ) : ordersData.error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg">{ordersData.error}</p>
            </div>
          ) : orderKeys.length > 0 ? (
            orderKeys.map((addressId) => (
              <OrderDetailsCard
                key={addressId}
                group={ordersData.orders[addressId]}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No orders found.</p>
            </div>
          )}
        </div>
      </div>

      {ordersData.totalOrders > 0 && (
        <Pagination
          totalItems={ordersData.totalOrders}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
};

export default MyOrders;
