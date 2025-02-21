import { useEffect, useRef, useState } from "react";
import Header from "../Header";
import { Footer } from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../redux/search/searchSlice";
import SpinWheel from "../SpinWheel";

const MainLayout = ({ children }) => {
  const isBrowser = () => typeof window !== "undefined";
  const [isVisible, setIsVisible] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);
  const sidebarRef = useRef(null); // Ref for sidebar
  const searchTerm = useSelector((state) => state.search.term);

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearchInput = () => {
    setIsSearchInputOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close search input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearchInputOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchInputRef]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains("sidebar-toggle")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
  }, []);

  useEffect(() => {
    // ... (Existing useEffect code)

    // Hide sidebar on smaller screens if not open
    const handleResize = () => {
      if (window.innerWidth < 840 && !isSidebarOpen) {
        setIsSidebarOpen(false); // Force close the sidebar
      }
    };

    window.addEventListener("resize", handleResize); // Add resize listener
    handleResize(); // Call it initially to set initial state

    return () => window.removeEventListener("resize", handleResize); // Clean up
  }, [isSidebarOpen]); // Add isSidebarOpen to dependency array


  return (
    <>
      <div>
        <Header toggleSearchInput={toggleSearchInput} />
        <div>{children}</div>

        {/* Sidebar Toggle Button */}
        <button
          className="sidebar-toggle fixed bottom-10 left-5 bg-[#006d77] text-white px-4 py-2 rounded-md"
          onClick={toggleSidebar}
        >
          🎡 Spin & Win
        </button>

        {/* Sidebar for SpinWheel */}
        {/* <div
          ref={sidebarRef}
          className={`fixed left-0 top-0 h-full bg-white w-1/2 shadow-lg transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ backgroundColor: "#fff", zIndex: 50 }} // Ensures solid background
        > */}
        <div
          ref={sidebarRef}
          className={`fixed left-0 top-0 h-full bg-white w-full md:w-1/2 shadow-lg transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`} 
          style={{ backgroundColor: "#fff", zIndex: 50 }}
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#ff7300]">
              Spin to Get Offers
            </h2>
            <button onClick={toggleSidebar} className="text-xl md:hidden"> {/* Hide close button on larger screens */}
              ✖
            </button>
          </div>
          <div className="p-5">
            <SpinWheel />
          </div>
          <button
            onClick={toggleSidebar}
            className="fixed bottom-10 right-10 bg-[#ff7300] text-white p-3 rounded-full z-50 md:hidden"
          >
            Spin
          </button>
        </div>

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
              className="w-full p-3 border-gray-300 rounded focus:outline-none"
            />
          </div>
        )}

        {/* Scroll to Top Button */}
        <div className={`scrollToTopButton ${isVisible ? "visible" : ""}`}>
          <button
            className="fixed bottom-0 hover:mb-[80px] hover:duration-300 right-0 rounded-s-full px-2 py-4 mr-5 mb-[71px] z-50 items-center flex gap-2"
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
