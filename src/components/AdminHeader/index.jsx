import React, { useState } from "react";
import { Link } from "react-router"; // Correct import
import AdminNavigationLinks from "./NavigationLinks";
import AdminSocialIcons from "./SocialIcons";
import { Menu, X } from "lucide-react";

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 bg-sky-50 transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="relative w-full flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/815194ebd73b1770653e9eeff880f6142915e483ce7502d72dbe90db2da05af4?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805"
              className="object-contain w-32 h-auto max-md:w-24"
              alt="Company logo"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6 transition-all duration-300 w-full md:w-auto">
            <AdminNavigationLinks />
          </div>

          <div className="flex items-center">
            <button
              className={`md:hidden block text-gray-600 mr-4 z-50 ${
                menuOpen ? "hidden" : ""
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <AdminSocialIcons />
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-2/4 bg-sky-50 shadow-md z-40 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden flex flex-col p-6`}
        >
          <button
            className={`absolute top-9 right-4 text-gray-600 z-50`}
            onClick={() => setMenuOpen(false)}
          >
            <X size={28} />
          </button>
          <div className="flex flex-col gap-4 mt-16">
            <AdminNavigationLinks />
          </div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
      </nav>
    </>
  );
};

export default AdminHeader;