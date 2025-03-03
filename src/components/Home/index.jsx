import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
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
import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "../AdminHeader";
import AdminNavigationLinks from "../AdminHeader/NavigationLinks";
import AdminSocialIcons from "../AdminHeader/SocialIcons";
import { setSearchTerm } from "../../redux/search/searchSlice";
import StickyVideo from "../StickyVideo";
import Popup from "../Popup";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInputRef = useRef(null); // Create a ref for the search input
  const searchTerm = useSelector((state) => state.search.term);
  const [showPopup, setShowPopup] = useState(false);

  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false); // State for search input visibility

  const toggleSearchInput = () => {
    setIsSearchInputOpen((prev) => !prev);
  };

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("popupShown");

    // If no record in localStorage, this is first visit
    if (!hasVisitedBefore) {
      // Show popup
      setShowPopup(true);
      // Set flag in localStorage to prevent showing again
      localStorage.setItem("popupShown", "true");
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearchInputOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchInputRef]);
  return (
    <>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-20 md:pt-32"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets/TEMP/0e1fb0b7f9396ddf4588cb6e6ecefabae011142fad4929408b10aa3a877411dc?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47')`,
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-16 md:px-16 md:py-56">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-8 md:gap-5">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <div className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[3px] text-black">
                  FRESH & SWEET AS HONEY
                </div>
                <div className="mt-2 text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-wider text-black leading-tight">
                  HONEYBEE
                </div>
                <div className="mt-6 md:mt-14 text-base md:text-lg lg:text-xl font-extrabold tracking-wide text-gray-700">
                  At Tuler, we are passionate about delivering pure, organic,
                  and high-quality honey. Our honey is harvested from the finest
                  floral sources, ensuring a rich taste, smooth texture, and
                  countless health benefits.
                </div>
                <button
                  className="mt-8 md:mt-11 px-6 py-4 md:px-9 md:py-5 text-base md:text-lg font-medium text-black bg-yellow-400 rounded-[30px] transition-colors duration-300 hover:bg-yellow-500"
                  onClick={() => navigate("/products")} // Use navigate here
                >
                  Shop Honey
                </button>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f4153f0473c59ba62497d0b2c178a37869743aa7dbb9d1e43206ae2d4e47c43?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Honey product showcase"
                  className="object-contain w-full h-auto"
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

      <div className="flex flex-col items-center px-4 py-16 w-full bg-stone-50 md:px-16 md:pt-32 md:pb-20">
        <div className="w-full max-w-[1455px]">
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Text Section */}
            <div className="w-full md:w-1/4 md:pr-4">
              <div className="flex flex-col items-start">
                <div className="text-xl md:text-2xl font-semibold text-yellow-400 leading-tight">
                  Shop By
                </div>
                <div className="xl:text-6xl sm:text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight">
                  Category
                </div>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 mt-6 md:mt-8 w-full md:w-auto text-base md:text-lg bg-yellow-400 font-medium text-center text-black rounded-[90px] transition duration-300 hover:bg-yellow-500"
                  aria-label="View all categories"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Image Grid */}
            {/* Image Grid Section */}
            <div className="w-full md:w-[55%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 md:mt-0">
                {images.slice(0, 2).map((image, index) => (
                  <div key={index} className="w-full">
                    <img
                      loading="lazy"
                      src={image.src}
                      alt={image.alt}
                      className="object-contain w-full h-auto rounded-none aspect-[1.05] md:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Single Image Section */}
            <div className="w-full md:w-[30%]">
              {images.length > 2 && (
                <img
                  loading="lazy"
                  src={images[2].src}
                  alt={images[2].alt}
                  className="object-contain w-full h-auto rounded-none aspect-[1.05] mt-8 md:mt-0 md:scale-105 transition-transform duration-300"
                />
              )}
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
          className="absolute top-2 left-0 object-contain w-full aspect-[0.73] max-w-[150px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[250px]"
        />

        <div className="text-center mt-[118px] w-1/2 max-md:w-full">
          <div className="text-3xl font-semibold text-yellow-400 mt-24">
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

        <div className="flex flex-col md:flex-row mt-10 gap-[40px] mb-[200px]">
          <div className="flex flex-wrap justify-center">
            <div className="flex flex-col items-start gap-[35px] ">
              {/* First Column */}
              <div className="relative w-full max-w-[243px] mt-20">
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
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]"
                />
                <div className="absolute top-28 left-10 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Promotes burn and <br />
                  wound healing
                </div>
              </div>
              {/* Second Column */}
              <div className="relative w-full max-w-[243px] mt-20">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7347629fd9372e51acd39f64a8d722093302fca7dc563639f143154488dc73?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Featured content"
                  className="object-contain w-full aspect-[1.12] max-w-[243px]"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/e5c9a65e65eccbfd559a6ade45829a6d180a57ca242cf4d6e4b43f3b27682258?placeholderIfAbsent=true&apiKey=712c726234fd496ca 49faeda0af47"
                  alt=""
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]"
                />
                <div className="absolute top-32 left-10 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Better for blood <br />
                  sugar levels
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start ml-4 mt-[200px] gap-[35px]">
              {/* Third Column */}
              <div className="relative w-full max-w-[243px] ">
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
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]"
                />
                <div className="absolute top-28 left-12 w-full text-base font-semibold text-center text-black max-w-[148px]">
                  Improve health and <br />
                  immune support
                </div>
              </div>
              {/* Fourth Column */}
              <div className="relative w-full max-w-[243px] mt-20">
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
                  className="absolute top-8 left-20 object-contain w-full aspect-[1.01] max-w-[71px]"
                />
                <div className="absolute top-28 left-11 w-full text-base font-semibold text-center text-black max-w-[148px]">
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
          className="absolute right-0 bottom-0 object-contain w-full aspect-[0.9] max-w-[189px]"
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
      <StickyVideo />
      {showPopup && <Popup onClose={handleClosePopup} />}
    </>
  );
};

export default Home;
