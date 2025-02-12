import React, { useEffect, useState, useMemo, useCallback } from "react";
import { get, put } from "../../services/http/axiosApi"; // Ensure you have a put method for updating
import { useSelector } from "react-redux";
import { Link } from "react-router";

export default function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [quantities, setQuantities] = useState({}); // State to hold quantities

  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

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

  const toggleCart = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsFadingOut(false);
    }, 300);
  }, []);

  const cartItems = useMemo(() => {
    return (
      cartData?.items?.map((item) => ({
        id: item._id,
        image: item.productId?.images?.[0] || "",
        title: item.productId?.name || "Unknown Product",
        price: item.price || 0,
        quantity: quantities[item._id] || 1, // Use quantities state
        weight: item.weight,
      })) || []
    );
  }, [cartData, quantities]);


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
            <div
              key={item.id}
              className="flex gap-7 items-center self-start mt-8 ml-6 font-semibold"
            >
              <div className="flex flex-col items-center w-14 py-2 bg-neutral-200 text-black rounded-3xl">
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-t-3xl"
                >
                  +
                </button>
                <span className="py-2 text-lg font-semibold">
                  {quantities[item.id] || 1}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-b-3xl"
                >
                  -
                </button>
              </div>
              <img
                loading="lazy"
                src={item.image}
                alt={item.title}
                className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[50px] w-[74px]"
              />
              <div className="flex flex-col self-stretch my-auto text-sm">
                <div className="text-neutral-900">{item.title}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="text-neutral-900">
                    {quantities[item.id] || 1}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-black">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-black">{item.weight}</span>{" "}
                  {/* Assuming weight is in kg */}
                </div>
              </div>
            </div>
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
