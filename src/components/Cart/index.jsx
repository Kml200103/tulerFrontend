import React, { useState } from "react";
import "./Cart.css"; // Import the CSS file for transitions
import CartItem from "./CartItem";
import { Link } from "react-router";

export const cartItems = [
  {
    id: 1,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1e820973b076995384d562e9a8e7a063f15e6781cc0f074f223a98a879bd4d7d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    title: "Acacia Honey, 100% Pure & Natural (320g)",
    discount: "11% off",
    originalPrice: "$19.25",
    discountedPrice: "$16.65",
    quantity: 1,
  },
  {
    id: 2,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d54a64243c7ca37fb8c3c3e19cb7361b87344c31da3753dc138acd3cbac57428?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    title: "Koshur Jangal Maachh (Black Forest Honey) 500gms",
    discount: "11% off",
    originalPrice: "$19.25",
    discountedPrice: "$16.65",
    quantity: 1,
  },
];

export default function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const toggleCart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsFadingOut(false);
    }, 300); // Match this duration with the CSS transition duration
  };

  if (!isCartOpen && !isFadingOut) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px]  bg-white shadow-lg p-6 overflow-hidden z-50 flex flex-col transition-transform duration-300 ${
        isCartOpen ? "open" : "closed"
      } ${isFadingOut ? "fade-out" : ""}`}
    >
      {/* Header with Cart Icon and Close Button */}
      <div className="flex items-center justify-between">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/620e45e22b9abd39329ae2f1db91b17636d8d6e35dcd110a32393670cecdbb08?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
          alt="Cart Icon"
          className="object-contain w-10"
        />
        <button
          onClick={toggleCart} // Close the cart on button click
          className="text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>

      <div className="mt-6 w-full bg-neutral-200 h-[1px]" />

      {/* Cart Items List */}
      <div className="overflow-y-auto flex-grow">
        {cartItems.map((item) => (
          <React.Fragment key={item.id}>
            <CartItem {...item} />
            <div className="mt-7 w-full bg-neutral-200 h-[1px]" />
          </React.Fragment>
        ))}
      </div>

      {/* Checkout Section */}
      <Link
        to="/checkout"
        className="py-3  bg-black text-white rounded-xl px-5 flex justify-between items-center mt-auto"
      >
        <span className="text-sm font-semibold">Checkout</span>
        <span className="px-5 py-2.5 text-base font-bold bg-yellow-400 text-black rounded-xl">
          $36.95
        </span>
      </Link>
    </div>
  );
}
