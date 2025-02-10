import { useState, useRef, useEffect } from "react";
import Cart from "../Cart";
import { Link } from "react-router"; // Make sure to import Link from react-router-dom

export default function SocialIcons({ toggleSearchInput }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual authentication logic
  const [userName, setUserName] = useState("John Doe"); // Replace with actual user data

  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const cartRef = useRef(null); // Create a ref for the cart

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown and cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, cartRef]);

  return (
    <div className="relative">
      <div className="flex text-lg gap-2 items-start">
        {/* Social Media Icons */}
        <button
          className="p-2 bg-transparent hover:bg-gray-200 rounded-full"
          aria-label="Visit our Social media icon 1"
          onClick={toggleSearchInput} // Open search input on click
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/aa2e8eb6df9306011f739e1312541a3dabbc1507426c5a278cea2cd9c17faf0e?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805"
            className="object-contain shrink-0 aspect-square w-[30px]"
            alt="Social media icon 1"
          />
        </button>

        <button
          className="p-2 bg-transparent hover:bg-gray-200 rounded-full"
          aria-label="Visit our Social media icon 2"
          onClick={toggleDropdown}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/283293b8ac51bd9733ed23a62ace0cd7696281466597f5b56d7b20cc191465e9?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805"
            className="object-contain shrink-0 aspect-square w-[25px]"
            alt="Social media icon 2"
          />
        </button>

        <button
          className="p-2 bg-transparent hover:bg-gray-200 rounded-full"
          aria-label="Visit our Social media icon 3"
          onClick={toggleCart}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a8d69cd46160b47eb3fdea162aaedfd579586976de6fd46e47a24c2265316ce?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec080 5"
            className="object-contain shrink-0 aspect-square w-8 "
          />
        </button>
      </div>

      {/* Dropdown for Login/Register or Profile */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown
          className="absolute right-3  bg-white border border-gray-300 rounded-lg shadow-lg mt-2 p-4 w-48"
        >
          {isLoggedIn ? (
            <div>
              <div className="mt-2">
                <Link
                  to="/profile"
                  className="block text-black text-center hover:underline"
                >
                  Profile
                </Link>
              </div>
              <div className="mt-2">
                <Link
                  to=""
                  className="block text-black text-center hover:underline"
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mt-2">
                <Link
                  to="/login"
                  className="block text-black text-center hover:underline"
                >
                  Login
                </Link>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="mt-2">
                <Link
                  to="/register"
                  className="block text-black text-center hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-in Cart */}
      {isCartOpen && (
        <div ref={cartRef}>
          {/* Attach the ref to the cart */}
          <Cart />
        </div>
      )}
    </div>
  );
}
