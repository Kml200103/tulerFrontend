import * as React from "react";
import { NavLink } from "react-router"; // Correct import

const navItems = [
  { text: "Home", path: "/" },
  { text: "Products", path: "/products" },
  // { text: "Offers", path: "/offers" },
  { text: "Contact", path: "/contact" },
];

export default function NavigationLinks() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-lg text-black"> {/* Added flex-col md:flex-row */}
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `transition-colors duration-300 ${
              isActive ? "font-bold text-neutral-900" : "text-gray-600"
            }`
          }
          role="menuitem"
        >
          {item.text}
        </NavLink>
      ))}
    </div>
  );
}