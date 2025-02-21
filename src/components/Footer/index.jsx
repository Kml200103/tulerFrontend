import React, { useState } from "react";
import { Link } from "react-router";
import { post } from "../../services/http/axiosApi";
import { NotificationService } from "../../services/Notifcation";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Contact Us", path: "/contact" },
];

const socialIcons = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/100c9a9662cfb7f59e59b24b876a5dada1ae0cdc6647d2993d9ac0a673c6a4bf?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/fe75986126104598bb16b6bd62dcd079327cebcfccb8a96b8b328aee8d374e9f?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/61b16ab1e3d391973e3fa87a2f9cffd0935343b28d8cfd74f80ba43226065df9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Social Media Icon 3",
  },
];

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const { receiveObj } = await post("/subscribe", {
        email,
      });
      if (receiveObj.status == true) {
        NotificationService.sendSuccessMessage(receiveObj.message);
        setEmail("");
      }
    } catch (error) {
      NotificationService.sendErrorMessage("Error Subscribing");
    }
  };
  return (
   

    <footer className="flex flex-col items-center px-4 py-16 w-full bg-sky-50 md:px-20 md:pt-20 md:pb-6">
      {" "}
      {/* Adjusted padding */}
      <div className="w-full max-w-[1498px]">
        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0">
          {" "}
          {/* Flex direction and gap */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
            {" "}
            {/* Menu section width and alignment */}
            <div className="text-2xl md:text-3xl font-semibold">Menu</div>{" "}
            {/* Responsive font size */}
            <div className="mt-4 md:mt-7 text-base md:text-xl font-medium">
              {" "}
              {/* Responsive font size and margin */}
              {menuItems.map((item) => (
                <div key={item.name} className="mb-2 md:mb-3">
                  {" "}
                  {/* Responsive margin */}
                  <Link to={item.path} className="hover:text-blue-600">
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-auto hidden md:block w-px bg-neutral-200 h-full"></div>{" "}
          {/* Vertical separator (hide on mobile) */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
            {" "}
            {/* Contact info section width and alignment */}
            <div className="text-2xl md:text-3xl font-semibold text-neutral-900">
              {" "}
              {/* Responsive font size */}
              Contact Us
            </div>
            <div className="mt-4 md:mt-7 text-base font-medium leading-7 text-neutral-700">
              4821 Ridge Top Cir, Anchorage Street, <br />
              Alaska 99508, USA.
            </div>
            <div className="mt-1 text-base font-medium leading-loose text-neutral-700">
              <span className="text-neutral-700">Call Us: </span>
              <span className="font-bold text-neutral-700">800.275.8777</span>
            </div>
            <div className="mt-6 md:mt-10 text-xl md:text-2xl font-semibold text-neutral-700">
              {" "}
              {/* Responsive font size and margin */}
              Social Links
            </div>
            <div className="flex justify-center md:justify-start gap-3 mt-4 md:mt-5">
              {" "}
              {/* Responsive margin and justify content */}
              {socialIcons.map((icon, index) => (
                <div
                  className="flex flex-col justify-center items-center px-2 bg-yellow-400 rounded-full h-[39px] w-[39px]"
                  key={index}
                >
                  <img
                    loading="lazy"
                    src={icon.src}
                    alt={icon.alt}
                    className="object-contain w-5 aspect-square"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-auto hidden md:block w-px bg-neutral-200 h-full"></div>{" "}
          {/* Vertical separator (hide on mobile) */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
            
            {/* Newsletter section width and alignment */}
            <div className="text-center"> {/* Center the content */}
      <div className="text-2xl md:text-3xl font-semibold text-neutral-900">
        Subscribe to Newsletter
      </div>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col md:flex-row gap-4 mt-4 md:mt-5 bg-white rounded-[30px] p-3 shadow-md w-full max-w-md mx-auto" // Added max-w-md and mx-auto
      >
        <input
          type="email"
          id="emailInput"
          className="w-full text-base font-semibold text-zinc-500 px-3 py-2 rounded-md focus:outline-none" // Responsive width
          placeholder="Your e-mail address"
          aria-label="Your e-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full px-6 py-2 text-white bg-yellow-400 text-base font-medium rounded-[30px] hover:bg-yellow-500" // Responsive width and font size
        >
          Subscribe
        </button>
      </form>
    </div>
            <div className="mt-3 text-base font-medium leading-7 text-neutral-700">
              Sign up with your email address to receive <br />
              news and updates.
            </div>
            {/* ... (bottle images - these can be made more responsive if needed) */}
          </div>
        </div>
        <div className="mt-8 md:mt-12 w-full h-px bg-neutral-200"></div>{" "}
        {/* Responsive margin */}
        <div className="text-center mt-3 md:mt-4 text-base font-medium text-black">
          {" "}
          {/* Responsive margin */}
          Copyright © 2025 Tuler. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
