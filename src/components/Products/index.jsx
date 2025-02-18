import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProductCard from "./ProductCard";
import { get } from "../../services/http/axiosApi";
import Pagination from "../Pagination";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const circleButtons = [{ key: "start" }, { key: "end" }];

const Products = () => {
  const navigate = useNavigate();
  const searchTerm = useSelector((state) => state.search.term);

  const [products, setProducts] = useState([]); // Store API products
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Adjust based on product range
  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0); // Total products from API
  const [totalPages, setTotalPages] = useState(0); // Total pages from API

  // State for sorting
  const [sortOption, setSortOption] = useState("default"); // default, lowToHigh, highToLow
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/all-products");
    } else {
      fetchProducts();
    }
  }, [navigate, currentPage, itemsPerPage]); // Add currentPage and itemsPerPage to dependencies

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await get(
        `/product?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response.isSuccess) {
        setProducts(response.receiveObj.products);
        setTotalProducts(response.receiveObj.totalProducts);
        setTopProducts(response.receiveObj.topProducts);
        setTotalPages(response.receiveObj.totalPages);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const minVariantPrice = Math.min(...product.variants.map((v) => v.price));
      const matchesPrice =
        minVariantPrice >= minPrice && minVariantPrice <= maxPrice;

      if (searchTerm.trim()) {
        return matchesSearch && matchesPrice;
      }
      if (maxPrice !== Infinity) {
        return matchesPrice;
      }
      return true;
    });
  }, [products, minPrice, maxPrice, searchTerm]);

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === "lowToHigh") {
      sorted.sort((a, b) => {
        const aPrice = Math.min(...a.variants.map((v) => v.price));
        const bPrice = Math.min(...b.variants.map((v) => v.price));
        return aPrice - bPrice;
      });
    } else if (sortOption === "highToLow") {
      sorted.sort((a, b) => {
        const aPrice = Math.min(...a.variants.map((v) => v.price));
        const bPrice = Math.min(...b.variants.map((v) => v.price));
        return bPrice - aPrice;
      });
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleChange = useCallback(
    debounce((event) => {
      const { name, value } = event.target;
      const parsedValue = Math.max(0, Number(value));

      if (name === "min") {
        setMinPrice(parsedValue > maxPrice ? maxPrice : parsedValue);
      } else {
        setMaxPrice(parsedValue < minPrice ? minPrice : parsedValue);
      }
    }, 300),
    [minPrice, maxPrice]
  );

  const getProductsByCategories = async () => {
    const { receiveObj } = await get("/category/all");
    if (receiveObj.success) {
      setCategories(receiveObj.categories);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    setError(null);
    try {
      const { receiveObj } = await get(
        `/product?categoryId=${categoryId}&page=${currentPage}&limit=${itemsPerPage}`
      );
      setProducts(receiveObj.products);
      setTotalProducts(receiveObj.totalProducts);
      setTotalPages(receiveObj.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductsByCategories();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const setPageSize = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="container flex overflow-hidden flex-col bg-white">
      <div className="container flex flex-col self-center mb-4 ml-2.5 w-full max-w-[1385px] max-md:mt-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between items-start w-full max-md:mr-2.5 max-md:max-w-full">
          <div className="text-3xl font-medium text-neutral-900 tracking-[2px] max-md:text-3xl">
            <span className="font-extrabold tracking-wider text-neutral-900">
              PRODUCTS
            </span>
          </div>
          <div className="flex gap-5 mt-2 text-center text-stone-500">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex gap-2 px-2 py-2 text-sm font-semibold bg-neutral-200"
              >
                <div>SORT BY</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2ae2d0d1344eee9754786ab04249477cc25d0d914353e3c63323d54ea86a8d1?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                  alt="Sort Icon"
                  className="object-contain shrink-0 my-auto w-4 aspect-[1.6]"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  <div
                    onClick={() => handleSortOptionChange("lowToHigh")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Price: Low to High
                  </div>
                  <div
                    onClick={() => handleSortOptionChange("highToLow")}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    Price: High to Low
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[1385px] max-md:flex-col">
        <div className="flex flex-col w-1/4 p-4 mt-5 bg-sky-50 border border-sky-50 border-solid rounded-[20px] max-md:w-full">
          <div className="flex flex-col px-4 w-full max-md:px-2">
            <div className="text-2xl font-semibold leading-[32px] text-neutral-700">
              Product categories
            </div>
            <div className="mt-2 text-lg font-medium leading-[32px] text-neutral-700 max-md:mr-2.5 max-md:ml-1">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  onClick={() => fetchProductsByCategory(category.id)}
                  className="cursor-pointer"
                >
                  <h2>
                    {category.name} ({category.productCount})
                  </h2>
                </div>
              ))}
            </div>
            <div className="p-4">
              <div className="self-start mt-4 mb-4 text-2xl font-semibold leading-[32px] text-neutral-700">
                Filter by price
              </div>
              <div className="flex justify-start mr-10">
                {circleButtons.map((button, index) => (
                  <React.Fragment key={button.key}>
                    <div className="flex flex-col justify-center items-center px-1.5 bg-yellow-400 rounded-full h-[25px] w-[25px]">
                      <div className="flex shrink-0 bg-white rounded-full h-[15px] w-[15px]" />
                    </div>
                    {index === 0 && (
                      <div className="flex shrink-0 self-start mt-1.5 max-w-full h-3.5 bg-yellow-400 w-[280px]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start px-4 w-full text-sm font-medium text-neutral-700 max-md:px-2">
            <div className="mt-4 text-2xl font-semibold leading-[32px] max-md:mt-5">
              Top Sellers
            </div>
            {isLoading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product._id} className="mb-4">
                  {" "}
                  {/* Add margin-bottom for spacing */}
                  <div className="flex gap-2 mt-3 ml-1">
                    <img
                      loading="lazy"
                      src={product.images[0]} // Display the first image
                      alt={product.name}
                      className="object-contain shrink-0 max-w-full aspect-square w-[80px]"
                    />
                    <div className="mt-3">
                      <span className="text-sm font-semibold leading-5 text-black">
                        {product.name}
                      </span>
                    </div>
                  </div>
                  <img
                    loading="lazy"
                    src={product.images[0]} // You can replace this with another image if needed
                    alt={product.name}
                    className="object-contain self-stretch mt-2 w-full aspect-[333.33] max-md:ml-0.5"
                  />
                </div>
              ))
            ) : (
              <div>No top sellers available.</div>
            )}
          </div>
        </div>

        <div className="container bg-white">
          <div className="text-3xl font-bold mb-4">PRODUCTS</div>

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts?.map((product) => (
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
      </div>
      <div className="mt-6">
        <Pagination
          totalItems={totalProducts} // Use totalProducts from API
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
          setPageSize={setPageSize}
          totalPages={totalPages} // Pass totalPages if needed
        />
      </div>
    </div>
  );
};

export default Products;
