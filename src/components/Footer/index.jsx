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
    <footer className="flex flex-col items-center px-20 pt-20 pb-6 mt-3 w-full bg-sky-50 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col w-full max-w-[1498px] max-md:max-w-full">
        {/* Footer Content */}
        <div className="flex justify-between items-start w-full max-w-[1461px] max-md:flex-col max-md:items-center max-md:text-center">
          {/* Menu Section */}
          <div className="flex flex-col text-black">
            <div className="text-3xl font-semibold">Menu</div>
            <div className="mt-7 text-xl font-medium">
              {menuItems.map((item) => (
                <div key={item.name} className="mb-3">
                  <Link to={item.path} className="hover:text-blue-600">
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="w-px bg-neutral-200 h-full hidden max-md:block"></div>

          {/* Contact Info Section */}
          <div className="flex flex-col ml-10 items-start ">
            <div className="text-3xl font-semibold text-neutral-900">
              Contact Us
            </div>
            <div className="mt-7 text-base font-medium leading-7 text-neutral-700">
              4821 Ridge Top Cir, Anchorage Street, <br />
              Alaska 99508, USA.
            </div>
            <div className="mt-1 text-base font-medium leading-loose text-neutral-700">
              <span className="text-neutral-700">Call Us: </span>
              <span className="font-bold text-neutral-700">800.275.8777</span>
            </div>

            {/* Social Links */}
            <div className="mt-10 text-3xl font-semibold text-neutral-700">
              Social Links
            </div>
            <div className="flex gap-3 mt-5">
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

          {/* Vertical Separator */}
          <div className="w-px bg-neutral-200 h-full hidden max-md:block"></div>

          {/* Newsletter Subscription Section */}

          {/* <div className="flex flex-col items-start self-end max-md:self-center max-md:text-center">
            <label htmlFor="emailInput" className="text-3xl font-semibold text-neutral-900">
              Subscribe to Newsletter
            </label>
            <div className="flex gap-4 items-center mt-5 bg-white rounded-[30px] p-3 shadow-md">
              <input
                className="text-base font-semibold text-zinc-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                type="email"
                id="emailInput"
                placeholder="Your email address"
                aria-label="Your email address"
              />
              <button
                className="px-6 py-2 text-white bg-black text-xl font-medium rounded-[30px] hover:bg-gray-800"
                type="submit">
                Subscribe
              </button>
            </div>
            <div className="mt-4 text-base font-medium leading-7 text-neutral-700">
              Sign up with your email address to receive <br />
              news and updates.
            </div>
          </div> */}
          {/* Newsletter Subscription Section */}

          <div className="flex flex-col items-start  max-md:mt-10 max-md:max-w-full ">
            <div className="ml-7 text-3xl font-semibold text-neutral-900 max-md:ml-2.5">
              Subscribe to Newsletter
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-10 pl-8 mt-5 text-center bg-white rounded-[30px] max-md:pl-5"
            >
              <label htmlFor="emailInput" className="sr-only">
                Your e-mail address
              </label>
              <input
                type="email"
                id="emailInput"
                className="my-auto text-base font-semibold basis-auto text-zinc-500 focus:outline-none focus:border-none"
                placeholder="Your e-mail address"
                aria-label="Your e-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                required
              />
              <button
                type="submit"
                className="z-10 px-9 py-3.5 mr-0 text-xl bg-yellow-400 font-medium text-black whitespace-nowrap rounded-[30px] max-md:px-5"
              >
                Subscribe
              </button>
            </form>

            <div className="flex flex-col self-stretch pl-8 mt-4 text-base font-medium leading-7 text-neutral-700 max-md:pl-5 max-md:max-w-full">
              <div className="self-start">
                Sign up with your email address to receive <br />
                news and updates
              </div>
              <div className="relative mt-4">
                {/* bottle image */}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/21d8913f5c9f45590a2651b620ce11816f44bdb57c2ea1f56a4f35bbca97c0c3?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-[238px] h-[177px] aspect-[1.34] absolute -top-10 right-1"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4f40c7ad209242c431087eb46f67908cbe969c2332847a2dee8ab347c95efbb?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt=""
                  className="object-contain w-[159px] h-[111px] aspect-[1.43] absolute top-5 -right-5 z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex mt-12 w-full h-px bg-neutral-200"></div>

        {/* Copyright */}
        <div className="text-center mt-4 text-base font-medium text-black">
          Copyright © 2025 Tuler. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
