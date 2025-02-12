import React, { useEffect, useState, useMemo, useCallback } from "react";
import { get, put } from "../../services/http/axiosApi"; // Ensure you have a put method for updating
import { useSelector } from "react-redux";
import { Link } from "react-router"; // Use react-router-dom

export default function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [quantities, setQuantities] = useState({}); // State to hold quantities
  const [updating, setUpdating] = useState(false); // Prevent multiple API calls

  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

  // Fetch Cart Data
  const fetchCartData = useCallback(async () => {
    if (!id) return;
    try {
      const { receiveObj } = await get(`/cart/${id}`);
      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 });

      // Initialize quantities state
      const initialQuantities = {};
      receiveObj?.cart?.items.forEach((item) => {
        initialQuantities[item._id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Optimized quantity update function
  const updateQuantity = useCallback(
    async (productId, weight, change) => {
      if (updating) return; // Prevent multiple requests at the same time
      setUpdating(true);

      setQuantities((prev) => {
        const newQuantity = Math.max((prev[productId] || 1) + change, 1);
        return { ...prev, [productId]: newQuantity };
      });

      try {
        const newQuantity = Math.max((quantities[productId] || 1) + change, 1);

        await put("/cart/update", {
          userId: id,
          productId,
          weight,
          quantity: newQuantity,
        });

        fetchCartData(); // Refresh cart
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      } finally {
        setUpdating(false);
      }
    },
    [id, updating, quantities, fetchCartData]
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg p-6 overflow-hidden z-50 flex flex-col transition-transform duration-300 ${
        isCartOpen ? "open" : "closed"
      } ${isFadingOut ? "fade-out" : ""}`}
    >
      <div className="flex items-center justify-between">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/620e45e22b9abd39329ae2f1db91b17636d8d6e35dcd110a32393670cecdbb08"
          alt="Cart Icon"
          className="object-contain w-10"
        />
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsCartOpen(false);
              setIsFadingOut(false);
            }, 300);
          }}
          className="text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>

      <div className="mt-6 w-full bg-neutral-200 h-[1px]" />

      <div className="overflow-y-auto flex-grow">
        {cartData?.items?.length > 0 ? (
          cartData.items.map((item) => (
            <div key={item._id} className="flex gap-7 items-center mt-8 ml-6 font-semibold">
              <div className="flex flex-col items-center w-14 py-2 bg-neutral-200 text-black rounded-3xl">
                <button
                  onClick={() => updateQuantity(item.productId._id, item.weight, 1)}
                  className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-t-3xl"
                >
                  +
                </button>
                <span className="py-2 text-lg font-semibold">
                  {quantities[item._id] || 1}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId._id, item.weight, -1)}
                  className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-b-3xl"
                >
                  -
                </button>
              </div>
              <img
                loading="lazy"
                src={item.productId?.images?.[0] || ""}
                alt={item.productId?.name || "Unknown Product"}
                className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[50px] w-[74px]"
              />
              <div className="flex flex-col self-stretch my-auto text-sm">
                <div className="text-neutral-900">{item.productId?.name}</div>
                <div className="text-gray-600 mt-1">Price: ${item.price.toFixed(2)}</div>
                <div className="text-gray-600 mt-1">Weight: {item.weight}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">Your cart is empty</p>
        )}
      </div>

      <Link
        to="/checkout"
        className="py-3 bg-black text-white rounded-xl px-5 flex justify-between items-center mt-auto"
      >
        <span className="text-sm font-semibold">Checkout</span>
        <span className="px-5 py-2.5 text-base font-bold bg-yellow-400 text-black rounded-xl">
          ${cartData?.totalPrice?.toFixed(2) || "0.00"}
        </span>
      </Link>
    </div>
  );
}
