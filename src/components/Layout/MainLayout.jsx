import { useEffect, useRef, useState } from "react";
import Header from "../Header";
import { Footer } from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/search/searchSlice";

const MainLayout = ({ children }) => {
  const isBrowser = () => typeof window !== "undefined"; // The approach recommended by Next.js
  const [isVisible, setIsVisible] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false); // State for search input visibility
  const dispatch = useDispatch();
  const searchInputRef = useRef(null); // Create a ref for the search input
  const searchTerm = useSelector((state) => state.search.term);
  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleScroll = () => {
    // Show the button when the user scrolls down
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearchInput = () => {
    setIsSearchInputOpen((prev) => !prev);
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
      <div className="">
        <Header toggleSearchInput={toggleSearchInput} />{" "}
        {/* Pass the toggle function to Header if needed */}
        <div className="mt-10">{children}</div>
        {/* Search Input */}
        {isSearchInputOpen && (
          <div
            ref={searchInputRef}
            className="absolute z-50 left-1/2 top-28 transform -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded-full shadow-lg p-5 w-[400px]"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full p-3  border-gray-300 rounded focus:outline-none  "
            />
          </div>
        )}
        <div className={`scrollToTopButton ${isVisible ? "visible" : ""}`}>
          <button
            className={`fixed bottom-0 hover:mb-[80px] hover:duration-300 right-0 rounded-s-full px-2 py-4 mr-5 mb-[71px] z-50 items-center flex gap-2`}
            onClick={scrollToTop}
          >
            <svg
              className="h-10 w-10 rounded-3xl p-1 bg-[#006d77]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,1)"
            >
              <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path>
            </svg>
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
