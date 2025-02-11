import React from "react";
import NavigationLinks from "./NavigationLinks";
import SocialIcons from "./SocialIcons";
import { Link } from "react-router";

const AdminHeader = () => {
  return (
    <nav
      className="  flex flex-col md:flex-row bg-sky-50 mb-10 items-center max-h-[308px] justify-around px-6 py-4"
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
        <SocialIcons />
      </div>
    </nav>
  );
};

export default AdminHeader;
