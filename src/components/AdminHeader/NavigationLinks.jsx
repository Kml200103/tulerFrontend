import * as React from "react";
import { NavLink } from "react-router"; // Correct import

const navItems = [
  { text: "Products", path: "/all-products" },
  { text: "Add Product", path: "/add-product" },
  { text: "All Orders", path: "/all-orders" },
  { text: "Offers", path: "/offers" },
];

export default function AdminNavigationLinks() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-lg text-black">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `transition-colors duration-300 ${
              isActive ? "font-bold text-neutral-900" : "text-gray-600"
            } ${isActive ? 'border-b-2 border-neutral-900 md:border-b-0' : ''} py-2 md:py-0`
          }
          role="menuitem"
        >
          {item.text}
        </NavLink>
      ))}
    </div>
  );
}