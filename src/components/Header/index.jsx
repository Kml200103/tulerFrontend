import * as React from "react";
import { Link, useLocation } from "react-router"; // Make sure to import from 'react-router-dom'
import AdminNavigationLinks from "../AdminHeader/NavigationLinks";
import AdminSocialIcons from "../AdminHeader/SocialIcons";
import NavigationLinks from "./NavigationLinks";
import SocialIcons from "./SocialIcons";

export default function Header({ toggleSearchInput, isLoggedIn, user }) {
  const location = useLocation();
  const isAdmin = isLoggedIn && user.role === "admin"; // Check if user is admin

  return (
    <>
      {location.pathname === "/" ? (
        isAdmin ? (
          <nav
            className="absolute top-0 left-0 w-full flex items-center justify-around px-6 py-4 z-20"
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
            <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
              <AdminNavigationLinks />
              <AdminSocialIcons />
            </div>
          </nav>
        ) : (
          <nav
            className="absolute top-0 left-0 w-full flex items-center justify-around px-6 py-4 z-20"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link to="/">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/815194ebd73b1770653e9eeff880f6142915e483ce7502d72dbe90db2da05af4?placeholderIfAbsent=true&apiKey=2b2b8edf847e4405b4bc7a5d98ec0805"
                className="object-contain w-32 h-auto max-md:w-24"
                alt="Company logo"
              />
            </Link>
            <div className="flex gap-6 items-center">
              <NavigationLinks />
              <SocialIcons toggleSearchInput={toggleSearchInput} />
            </div>
          </nav>
        )
      ) : (
        <nav
          className="flex flex-col md:flex-row bg-sky-50 mb-10 items-center max-h-[308px] justify-around px-6 py-4"
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
          <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto">
            <NavigationLinks />
            <SocialIcons toggleSearchInput={toggleSearchInput} />
          </div>
        </nav>
      )}
    </>
  );
}
