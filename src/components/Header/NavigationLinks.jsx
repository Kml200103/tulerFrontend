import * as React from "react";
import { NavLink } from "react-router";

const navItems = [
  { text: "Home", path: "/" },
  { text: "Products", path: "/products" },
  { text: "Offers", path: "/offers" },
  { text: "Contact", path: "/contact" },
];

export default function NavigationLinks() {
  return (
    <div className="flex gap-6 text-xl text-black">
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
