import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import ProductCard from "./ProductCard";
import { get } from "../../services/http/axiosApi";
import Pagination from "../Pagination";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Products = () => {
  const navigate = useNavigate();
  const searchTerm = useSelector((state) => state.search.term);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const dropdownRef = useRef(null); // Ref for the dropdown

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get(
        `/product?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response.isSuccess) {
        setProducts(response.receiveObj.products);
        setTotalProducts(response.receiveObj.totalProducts);
        setTotalPages(response.receiveObj.totalPages);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const minVariantPrice = Math.min(...product.variants.map((v) => v.price));
      const matchesPrice =
        minVariantPrice >= minPrice && minVariantPrice <= maxPrice;
      return matchesSearch && matchesPrice;
    });
  }, [products, minPrice, maxPrice, searchTerm]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((v) => v.price));
      const bPrice = Math.min(...b.variants.map((v) => v.price));
      if (sortOption === "lowToHigh") return aPrice - bPrice;
      if (sortOption === "highToLow") return bPrice - aPrice;
      if (sortOption === "AtoZ") return a.name.localeCompare(b.name);
      if (sortOption === "ZtoA") return b.name.localeCompare(a.name);
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortOption]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleSortOptionChange = useCallback((option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
    setSelectedSortOption(option);
  }, []);

  const resetSorting = useCallback(() => {
    setSortOption("default");
    setIsDropdownOpen(false);
    setSelectedSortOption(null);
  }, []);

  const onPageChange = useCallback((page) => setCurrentPage(page), []);
  const setPageSize = useCallback((size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="container flex flex-col bg-white mt-10">
      <div className="container flex flex-col self-center mb-4 ml-2.5 w-full max-w-[1385px] max-md:mt -5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between items-start w-full max-md:mr-2.5 max-md:max-w-full">
          <div className="text-3xl font-medium text-neutral-900 tracking-[2px] max-md:text-3xl">
            <span className="font-extrabold tracking-wider text-neutral-900">
              PRODUCTS
            </span>
          </div>
          <div className="flex gap-5 text-center text-stone-500 pt-[72px] md:pt-[96px] mt-8">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex gap-2 px-2 py-2 text-sm font-semibold bg-neutral-200"
              >
                <div>SORT BY</div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2ae2d0d1344eee9754786ab04249477cc25d0d914353e3c63323d54ea86a8d1"
                  alt="Sort Icon"
                  className="object-contain shrink-0 my-auto w-4 aspect-[1.6]"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 min-w-[160px] bg-white border border-gray-300 rounded shadow-lg xs:right-0 xs:ml-auto sm:right-auto">
                  <div
                    onClick={() => handleSortOptionChange("lowToHigh")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Price, Low to High
                  </div>
                  <div
                    onClick={() => handleSortOptionChange("highToLow")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Price , High to Low
                  </div>
                  <div
                    onClick={() => handleSortOptionChange("AtoZ")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Alphabetically , A-Z
                  </div>
                  <div
                    onClick={() => handleSortOptionChange("ZtoA")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Alphabetically, Z-A
                  </div>
                </div>
              )}
            </div>

        
            {selectedSortOption && (
              <button
                onClick={resetSorting}
                className="ml-4 px-4 py-2 text-sm text-blue-600 transition hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container bg-white">
        <div className="text-3xl font-bold mb-4 mt-2">PRODUCTS</div>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

      
        {searchTerm && sortedProducts.length > 0 && (
          <div className="mb-4 text-gray-600 italic">
            Showing results for "{searchTerm}" ({sortedProducts.length}{" "}
            {sortedProducts.length === 1 ? "product" : "products"} found)
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : "No products available."}
          </p>
        )}
      </div>

      {products.length > 0 && (
        <div className="mt-6">
          <Pagination
            totalItems={totalProducts}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            setPageSize={setPageSize}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
