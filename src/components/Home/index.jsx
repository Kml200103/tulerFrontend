import React, { useState } from "react";
import { Link } from "react-router";
import NavigationLinks from "../Header/NavigationLinks";
import SocialIcons from "../Header/SocialIcons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HoneyBlend from "../HoneyTypes/HoneyBlend";
import { HoneyCard } from "../HoneyTypes/HoneyCard";
import { BenefitCard } from "../Benefit/BenefitCard";
import TestimonialCard from "../Testimonial/TestimonialCard";
import { Footer } from "../Footer";
import { useSelector } from "react-redux";
import AdminHeader from "../AdminHeader";
import AdminNavigationLinks from "../AdminHeader/NavigationLinks";
import AdminSocialIcons from "../AdminHeader/SocialIcons";

const honeyProducts = [
  {
    title: "RAW HONEY",
    description:
      "Raw honey is honey that is unprocessed, unpasteurized, and often unfiltered, meaning it is taken directly from the hive",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3de3b8233f7ed0030ee0d5c2578fe11f1f647100bbb954aaf215d6cc5c2fc869?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
  {
    title: "SAGE HONEY",
    description:
      "Sage honey is a type of honey made by bees that primarily collect nectar from sage plants, especially species in the Salvia genus.",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0e9b6e00a8de9ea90a3e99cb6c679e7cf784e10f40d8aa715a712fae8cd185cf?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
  {
    title: "HONEY BLEND",
    description:
      "A honey blend refers to a product that combines natural honey with other ingredients, such as additional sweeteners",
    imageSrc:
      " https://cdn.builder.io/api/v1/image/assets/TEMP/669e15bde4a287bf027d8b1bfdc30b400579aa5ccaa19f36f80ac1d362490c6b?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
  },
];

// const products = [
//   {
//     imgSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/c000a97bc014e7856faeb2a21d008e47996125e3d3e2d379a2a9cb768f4d1b88?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     altText: "Acacia Honey",
//     name: "Acacia Honey",
//     price: "$13.25",
//     discount: 20,
//     ratings: [
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/381d98a1e7f295b3bec7f4ea84e6687add44348be10288ed758a689336b014b9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/7b3b366a614c3d7e43d0ecb2b4de6d6fd14cf8e3b339cdc0fc672c1674bf37b5?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/82bb6e6bbd16cbfcf7c81874e67d60d525b69b100e91e832758a0d53da0110eb?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/d0e700d508590133b1c8d38554740d78bc7c9c841fd58ec71f19ad0c9240b07e?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/cd1db83f6ff6f45050ce5cbfd8148656e569dffda926fdbcf345db39a35c5442?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     ],
//   },
//   {
//     imgSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/01a0fd7286148713d5f172805aada435495b7390f1db004e0f1e8693fa84d226?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     altText: "Multi Flower Honey",
//     name: "Multi Flower Honey",
//     price: "$19.55 - $46.99",
//     discount: 10,
//     ratings: [
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/1fba96ff68655a17dcf15a9b4286b3c7b238842bd63174c17b5292560ec0d75e?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/4e5e718a936cb52238e08cf0b2e76c0f53c43e24e72a40f0358898a745781712?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/d1201a48c90c56a46e0aa9284686a775bf48dffe94fa4937acb2e2615bc8ffdc?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/7a03c14574123938ccc1440b93ed0dd2b350c9f544d6472d6ac450d1a9100000?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/16d9e69d96cba5d1fd2be85f9a4e6f716abe1b3165f6eb81a403ad511c6011c4?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     ],
//   },
//   {
//     imgSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/faaa0b7cbbb405ee439040529d4a17a727e430a8f58669a7ccb1afa820fec4d9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     altText: "Kashmir Black Forest Honey",
//     name: "Kashmir Black Forest Honey",
//     price: "$17.25",
//     discount: null,
//     ratings: [
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/381d98a1e7f295b3bec7f4ea84e6687add44348be10288ed758a689336b014b9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/7b3b366a614c3d7e43d0ecb2b4de6d6fd14cf8e3b339cdc0fc672c1674bf37b5?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/82bb6e6bbd16cbfcf7c81874e67d60d525b69b100e91e832758a0d53da0110eb?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/d0e700d508590133b1c8d38554740d78bc7c9c841fd58ec71f19ad0c9240b07e?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/cd1db83f6ff6f45050ce5cbfd8148656e569dffda926fdbcf345db39a35c5442?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     ],
//   },
// ];

const images = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/029803649a115511fe8b7bebc7facac58828d1c6c02e673995196c25f594a584?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Category product showcase 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/2823ebf7cc006bf45da6bb013c5807913ec5d3e05066c330d7aeee0c44d174f4?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Category product showcase 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/213594b9470ebd39ce1276f3647d8e39a603da6a65fb5411b9173c35cb908e65?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    alt: "Category product showcase 3",
  },
];

// const benefitsData = [
//   {
//     image:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e330948d463d832f7408f67b12aaaed494b0c359f56e8b63af980662d8b90aeb?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     text: "Promotes burn and<br/>wound healing",
//     variant: "light",
//   },
//   {
//     image:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e5c9a65e65eccbfd559a6ade45829a6d180a57ca242cf4d6e4b43f3b27682258?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     text: "Better for blood<br/>sugar levels",
//     variant: "centered spaced",
//   },
//   {
//     image:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/042472d9d822b990a3f43b172ffc1be2e4358b6a1617a423fa643907c69c8064?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3614b1c4de446ef3c9c7e64c596ec50337cafc2826391996dc141e01a7c73805?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     text: "Improve health and<br/>immune support",
//     variant: "light",
//   },
//   {
//     image:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/042472d9d822b990a3f43b172ffc1be2e4358b6a1617a423fa643907c69c8064?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/81103e8ac05c90dcc9673a718695a05cd178db37719ae966daf5ab8e8609f6d5?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     text: "Contains a variety<br/>of nutrients",
//     variant: "centered narrow spaced",
//   },
// ];

const testimonials = [
  {
    name: "SUZANA",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo sed aenean amet lacus.Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1f94037d22725ddf9531764010ae61b2809df10e5b645839b278f3cba797593c?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imagePosition: "left",
  },
  {
    name: "LÍVIA",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo sed aenean amet lacus.Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/73f13c2f90242c2925b2f4ed184b10f31a98c11891c8c78a381e598864d7d88a?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imagePosition: "center",
  },
  {
    name: "KÁTIA",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo sed aenean amet lacus.Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/76089bc8d8ea510e8f06c25e6dfb836b999561c2f176f7ee1149b97e83b97e05?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imagePosition: "center",
  },
  {
    name: "MATHEUS",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo sed aenean amet lacus.Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1f94037d22725ddf9531764010ae61b2809df10e5b645839b278f3cba797593c?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imagePosition: "right",
  },
  {
    name: "MATHEUS",
    quote:
      "Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo sed aenean amet lacus.Lorem ipsum dolor sit amet consectetur. Elit sociis consequat venenatis justo.",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1f94037d22725ddf9531764010ae61b2809df10e5b645839b278f3cba797593c?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imagePosition: "right",
  },
];
const Home = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const isAdmin = isLoggedIn && user.role === "admin"; // Check if user is admin
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false); // State for search input visibility

  const toggleSearchInput = () => {
    setIsSearchInputOpen((prev) => !prev);
  };
  return (
    <>
      {isAdmin ? (
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
            <SocialIcons toggleSearchInput={toggleSearchInput} />{" "}
          </div>
        </nav>
      )}

      {isSearchInputOpen && (
        <div className="absolute z-50 left-1/2 top-32 transform -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded-full shadow-lg p-5 w-96">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" // Standard border without rounded-full
          />
        </div>
      )}

      <section>
        <div className="flex relative flex-col items-center px-16 pt-56 pb-6 w-full rounded-none min-h-[774px] max-md:px-5 max-md:pt-24 max-md:max-w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e1fb0b7f9396ddf4588cb6e6ecefabae011142fad4929408b10aa3a877411dc?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
            alt=""
            className="object-cover absolute inset-0 size-full"
          />
          <div className="relative ml-8 w-full max-w-[1422px] max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[43%] max-md:ml-0 max-md:w-full">
                <div className="flex relative flex-col mt-40 max-md:mt-10 max-md:max-w-full">
                  <div className="self-start text-xl text-neutral-900 tracking-[3px]">
                    <span className="font-medium text-neutral-900">
                      FRESH & SWEET AS HONEY
                    </span>
                  </div>
                  <div className="mt-2 text-base font-medium text-neutral-900 tracking-[2.4px] max-md:max-w-full">
                    <span className="text-8xl font-extrabold tracking-wider text-neutral-900">
                      HONEYBEE
                    </span>
                  </div>
                  <div className="flex flex-col items-start pr-20 pl-1.5 mt-14 max-md:pr-5 max-md:mt-10 max-md:max-w-full">
                    <div className="text-xl font-extrabold tracking-wide text-neutral-700 max-md:max-w-full">
                      <span className="leading-7 text-neutral-700">
                        Lorem ipsum dolor sit amet, sint nostrum mea ut, vel
                        semper vidisse eu usu temporibus disputationi
                        voluptatibus in ei est possit salutandi abhorrea acusa
                      </span>
                    </div>
                    <button
                      className="px-9 py-5 mt-11 text-lg font-medium text-black bg-yellow-400 rounded-[30px] max-md:px-5 max-md:mt-10"
                      tabIndex="0"
                    >
                      Shop Honey
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[57%] max-md:ml-0 max-md:w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f4153f0473c59ba62497d0b2c178a37869743aa7dbb9d1e43206ae2d4e47c43?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Honey product showcase"
                  className="object-contain grow w-full aspect-[1.41] max-md:mt-10 max-md:max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className=" container rounded-xl pt-5 ">
        <div className="flex gap-5 max-md:flex-col">
          {honeyProducts.map((honey) => (
            <HoneyCard
              key={honey.id}
              title={honey.title}
              description={honey.description}
              image={honey.imageSrc}
            />
          ))}
        </div>
      </div>

      <div className=" fle x flex-col items-center px-16 pt-32 pb-20 w-full bg-stone-50 max-md:px-5 max-md:pt-24 max-md:max-w-full">
        <div className="  ml-5 w-full max-w-[1455px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[28%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start self-stretch my-auto max-md:mt-10">
                <div className="text-2xl font-semibold text-yellow-400">
                  Shop By
                </div>
                <div className="self-stretch text-6xl font-extrabold text-neutral-900 max-md:text-4xl">
                  Category
                </div>
                <button
                  className="px-14 py-3 mt-14 max-w-full text-lg bg-yellow-400  font-medium text-center text-black rounded-[90px] w-[200px] max-md:px-5 max-md:mt-10"
                  aria-label="View all categories"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[40%] max-md:ml-0 max-md:w-full">
              <div className="grow max-md:mt-8 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                    <img
                      loading="lazy"
                      src={images[0].src}
                      alt={images[0].alt}
                      className="object-contain w-full rounded-none aspect-[0.92] max-md:mt-3"
                    />
                  </div>
                  <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                    <img
                      loading="lazy"
                      src={images[1].src}
                      alt={images[1].alt}
                      className="object-contain grow w-full rounded-none aspect-[0.9] max-md:mt-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[19%] max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                src={images[2].src}
                alt={images[2].alt}
                className="object-contain shrink-0 max-w-full rounded-none aspect-[0.92] w-[315px] max-md:mt-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* benefits section */}
      <div
        className="flex flex-col items-center mt-10 bg-sky-50 min-h-[1200px] relative"
        style={{
          borderBottomLeftRadius: "400px", // Increased radius for more rounding
        }}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/028e9fe3de5a717452f980dfc02e1d79980b9640ef58165189a444cdc6cd89b6?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
          alt="Product showcase"
          className="absolute top-2 left-0 object-contain w-full aspect-[0.73] max-w-[172px]"
        />

        <div className="text-center mt-[118px] w-1/2">
          <div className="text-3xl font-semibold text-yellow-400 mt-2">
            Discover
          </div>
          <div className="w-full text-7xl font-extrabold text-neutral-900 max-md:max-w-full max-md:text-4xl">
            The Benefits of Honey Products
          </div>
        </div>
        <div className="pt-0 mt-5 w-full text-base font-medium leading-7 text-center max-w-[950px] text-neutral-700 max-md:max-w-full">
          The benefits of raw honey include the nutrients and antioxidants it
          contains. Honey is also better for your blood sugar and your heart,
          and it may promote healing. Honey is a syrupy liquid that honeybees
          make from plant nectar.
        </div>

        <div className="flex mt-10 gap-[40px] mb-[200px]">
          <div className="flex flex-wrap justify-center">
            <div className="flex flex-col items-start gap-[35px] ">
              <div className="relative w-full max-w-[243px] mt-20">
                {" "}
                {/* Container for positioning */}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-full aspect-[1.12] max-w-[243px]"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e330948d463d832f7408f67b12aaaed494b0c359f56e8b63af980662d8b90aeb?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt=""
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]" // Positioned over the first image
                />
                <div className=" absolute top-28 left-10 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Promotes burn and <br />
                  wound healing
                </div>
              </div>
              <div className="relative w-full max-w-[243px] mt-20">
                {" "}
                {/* Container for positioning */}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-full aspect-[1.12] max-w-[243px]"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e5c9a65e65eccbfd559a6ade45829a6d180a57ca242cf4d6e4b43f3b27682258?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt=""
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]" // Positioned over the first image
                />
                <div className=" absolute top-32 left-10 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Better for blood <br />
                  sugar levels
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start ml-4 mt-[200px] gap-[35px]">
              <div className="relative w-full max-w-[243px] ">
                {" "}
                {/* Container for positioning */}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-full aspect-[1.12] max-w-[243px]"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3614b1c4de446ef3c9c7e64c596ec50337cafc2826391996dc141e01a7c73805?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt=""
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]" // Positioned over the first image
                />
                <div className=" absolute top-28 left-12 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Improve health and <br />
                  immune support
                </div>
              </div>
              <div className="relative w-full max-w-[243px] mt-20">
                {" "}
                {/* Container for positioning */}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-full aspect-[1.12] max-w-[243px]"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/81103e8ac05c90dcc9673a718695a05cd178db37719ae966daf5ab8e8609f6d5?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt=""
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]" // Positioned over the first image
                />
                <div className=" absolute top-28 left-11 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Contains a variety <br />
                  of nutrients
                </div>
              </div>
            </div>
          </div>
          <div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6fed36deb61b9e117f7fcddfcb97436f0e01226088829c38667107a6667de04c?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt="Featured content display"
              className="object-contain w-full aspect-[0.96] max-w-[597px]"
            />
          </div>
        </div>

        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/504963f9f665c86d5d6664191f3b4697659eb9b172b1b67bcef6dbf6b660d7ad?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
          alt="Featured content"
          className=" absolute right-0 bottom-0 object-contain w-full aspect-[0.9] max-w-[189px]"
        />
      </div>

      <div className="mt-20 flex flex-col pb-5 text-center">
        <div className="z-10 self-center -mt-1.5 text-3xl font-semibold text-yellow-400">
          Testimonials
        </div>
        <div className="mt-2.5 w-full text-7xl font-extrabold text-neutral-900 max-md:max-w-full max-md:text-4xl">
          Customers Say
        </div>
        <div className="flex justify-center mt-4 gap-1">
          {[...Array(5)].map((_, i) => (
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/381d98a1e7f295b3bec7f4ea84e6687add44348be10288ed758a689336b014b9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              className="w-6 h-6 text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>
      </div>
      <div className="container px-8 max-md:px-5 my-8">
        {" "}
        {/* Add margin to the whole Swiper component */}
        <div className="my-6">
          {" "}
          {/* Margin around Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="my-4" /* Add extra margin inside Swiper */
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <TestimonialCard
                  name={testimonial.name}
                  quote={testimonial.quote}
                  image={testimonial.image}
                  imagePosition={testimonial.imagePosition}
                />
              </SwiperSlide>
            ))}
            <div className="swiper-pagination"></div>
          </Swiper>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
