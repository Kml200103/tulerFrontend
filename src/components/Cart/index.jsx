import React, { useEffect, useState, useMemo, useCallback } from "react";
import CartItem from "./CartItem";
import "./Cart.css"; // Import CSS
import { get } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import { Link } from "react-router"; // Fixed incorrect import

export default function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cartData, setCartData] = useState(null);

  // Ensure we have `user` before accessing `id`
  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

  // Fetch cart data from API using useCallback
  const fetchCartData = useCallback(async () => {
    if (!id) return;

    try {
      const { receiveObj } = await get(`/cart/${id}`);
      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 }); // Ensure cartData is always valid
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Use useCallback to prevent unnecessary re-creation
  const toggleCart = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsFadingOut(false);
    }, 300);
  }, []);

  if (!isCartOpen && !isFadingOut) return null;

  // Memoized cart items for performance optimization
  const cartItems = useMemo(() => {
    return (
      cartData?.items?.map((item) => ({
        id: item._id,
        image: item.productId?.images?.[0] || "", // Ensure image exists
        title: item.productId?.name || "Unknown Product",
        price: item.price || 0,
        quantity: item.quantity || 1,
      })) || []
    );
  }, [cartData]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg p-6 overflow-hidden z-50 flex flex-col transition-transform duration-300 ${
        isCartOpen ? "open" : "closed"
      } ${isFadingOut ? "fade-out" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/620e45e22b9abd39329ae2f1db91b17636d8d6e35dcd110a32393670cecdbb08"
          alt="Cart Icon"
          className="object-contain w-10"
        />
        <button
          onClick={toggleCart}
          className="text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>

      <div className="mt-6 w-full bg-neutral-200 h-[1px]" />

      {/* Cart Items */}
      <div className="overflow-y-auto flex-grow">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <CartItem {...item} />
              <div className="mt-7 w-full bg-neutral-200 h-[1px]" />
            </React.Fragment>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">Your cart is empty</p>
        )}
      </div>

      {/* Checkout */}
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
