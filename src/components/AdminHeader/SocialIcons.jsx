import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router"; // Make sure to import Link from react-router-dom
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";

export default function AdminSocialIcons() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const router = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    router("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative">
      <div className="flex text-lg gap-2 items-start">
        {/* Social Media Icons */}
        {/* <button
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
        </button> */}

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
      </div>

      {/* Dropdown for Login/Register or Profile */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown
          className="absolute right-3 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 p-4 w-48"
        >
          {isLoggedIn ? (
            <div>
              <div className="mt-2">
                <Link
                  to="/adminProfile"
                  className="block text-black text-center hover:underline"
                >
                  Profile
                </Link>
              </div>
              <div className="mt-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-black text-center hover:underline"
                >
                  Logout
                </button>
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
    </div>
  );
}
