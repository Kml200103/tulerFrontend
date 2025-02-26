import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminNavigationLinks from "../AdminHeader/NavigationLinks";
import AdminSocialIcons from "../AdminHeader/SocialIcons";
import NavigationLinks from "./NavigationLinks";
import SocialIcons from "./SocialIcons";
import { useSelector } from "react-redux";

export default function Header({ toggleSearchInput }) {
  const location = useLocation();
  const navigate = useNavigate(); // Access navigate function
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const isAdmin = isLoggedIn && user?.role === "admin"; // Added optional chaining
  console.log(isAdmin);

  const [menuOpen, setMenuOpen] = useState(false);

  const renderNavContent = () => {
    return isAdmin ? <AdminNavigationLinks /> : <NavigationLinks />;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300">
        <nav
          className={`relative w-full flex items-center justify-between px-6 py-4 transition-all duration-300 ${
            location.pathname !== "/"
              ? "md:flex-row md:items-center md:max-h-[308px]"
              : ""
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <Link to="/" className="flex items-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/815194ebd73b1770653e9eeff880f6142915e483ce7502d72dbe90db2da05af4?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805"
              className="object-contain w-32 h-auto max-md:w-24"
              alt="Company logo"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6 transition-all duration-300 w-full md:w-auto">
            {renderNavContent()}
          </div>

          <div className="flex items-center">
            <button
              className={`md:hidden  block text-gray-600 mr-4 z-50 ${
                menuOpen ? "hidden" : ""
              } `}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <SocialIcons toggleSearchInput={toggleSearchInput} />
          </div>
        </nav>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-2/4 bg-white shadow-md z-40 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden flex flex-col p-6`}
        >
          <button
            className={`absolute top-9 right-4 text-gray-600 z-50 `}
            onClick={() => setMenuOpen(false)}
          >
            <X size={28} />
          </button>
          <div className="flex flex-col gap-4 mt-16">{renderNavContent()}</div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
      </header>
    </>
  );
}
