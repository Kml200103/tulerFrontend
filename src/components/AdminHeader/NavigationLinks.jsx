import * as React from "react";
import { NavLink } from "react-router";

const navItems = [
  { text: "Products", path: "/all-products" },
  { text: "Add Product", path: "/add-product" },
  { text: "All Orders", path: "/all-orders" },
];

export default function AdminNavigationLinks() {
  return (
    <div className="flex gap-6 text-lg text-black">
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
