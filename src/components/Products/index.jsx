import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProductCard from "./ProductCard";
import { get } from "../../services/http/axiosApi";
import Pagination from "../Pagination";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Slider from "@mui/material/Slider";

const Products = () => {
  const navigate = useNavigate();
  const searchTerm = useSelector((state) => state.search.term);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get(`/product?page=${currentPage}&limit=${itemsPerPage}`);
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
  }, [currentPage, itemsPerPage])

  const getProductsByCategories = useCallback(async () => {
    try {
      const { receiveObj } = await get("/category/all");
      if (receiveObj.success) {
        setCategories(receiveObj.categories);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (error) {
      setError("Failed to fetch categories.");
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/product?page=${currentPage}&limit=${itemsPerPage}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      const { receiveObj } = await get(url);
      setProducts(receiveObj.products);
      setTotalProducts(receiveObj.totalProducts);
      setTotalPages(receiveObj.totalPages);
    } catch (error) {
      setError("Failed to fetch products.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);
  ;

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/all-products");
    } else {
      fetchProductsByCategory(null);
    }
  }, [navigate, fetchProductsByCategory]);

  useEffect(() => {
    getProductsByCategories();
  }, [getProductsByCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const minVariantPrice = Math.min(...product.variants.map((v) => v.price));
      const matchesPrice = minVariantPrice >= minPrice && minVariantPrice <= maxPrice;
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
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortOption]);

  const toggleDropdown = useCallback(() => setIsDropdownOpen((prev) => !prev), []);
  const handleSortOptionChange = useCallback((option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  }, []);
  const onPageChange = useCallback((page) => setCurrentPage(page), []);
  const setPageSize = useCallback((size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  return (
    <div className="container flex  flex-col bg-white ">
      <div className="container flex flex-col self-center mb-4 ml-2.5 w-full max-w-[1385px] max-md:mt-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between items-start w-full max-md:mr-2.5 max-md:max-w-full">
          <div className="text-3xl font-medium text-neutral-900 tracking-[2px] max-md:text-3xl">
            {/* <span className="font-extrabold tracking-wider text-neutral-900">
              PRODUCTS
            </span> */}
          </div>
          <div className="flex gap-5  text-center text-stone-500 pt-[72px] md:pt-[96px] mt-8">
            <div className="relative">
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
                <div
                  className="absolute z-10 min-w-[160px] bg-white border border-gray-300 rounded shadow-lg 
    xs:right-0 xs:ml-auto sm:right-auto"
                >
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
        {/* Sidebar: Categories & Filters */}
        <div className="w-1/4 md:w-[35%] lg:w-1/4 p-4 bg-sky-50 border border-sky-50 rounded-[20px] max-md:w-full sm:mb-11">
          <div className="flex flex-col px-4 w-full max-md:px-2">
            <div className="text-2xl font-semibold leading-[32px] text-neutral-700">
              Product categories
            </div>
            <div className="mt-2 text-lg font-medium leading-[32px] text-neutral-700 max-md:mr-2.5 max-md:ml-1">
              <div
                onClick={() => fetchProductsByCategory(null)}
                className="cursor-pointer " // Added margin-bottom for spacing
              >
                All
              </div>
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
            <div className="p-4 w-full">
              <div className="self-start mt-4 mb-4 text-2xl font-semibold leading-[32px] text-neutral-700">
                Filter by price
              </div>

              {/* Price Range Slider */}
              <Slider
                value={[minPrice, maxPrice]}
                onChange={(event, newValue) => {
                  setMinPrice(newValue[0]);
                  setMaxPrice(newValue[1]);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                sx={{
                  color: "#F9C300",
                  height: 5,
                  "& .MuiSlider-thumb": {
                    height: 18,
                    width: 18,
                    backgroundColor: "#fff",
                    border: "2px solid currentColor",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "inherit",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 5,
                    borderRadius: 5,
                  },
                  "& .MuiSlider-rail": {
                    height: 5,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                  },
                }}
                className="w-full sm:w-[90%] mx-auto"
              />

              {/* Min and Max Price Inputs */}
              <div className="flex flex-wrap sm:flex-nowrap md:justify-center mt-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full sm:w-24 p-2 border border-gray-300 rounded-md text-sm text-center"
                  placeholder="Min"
                />
                <span className="mx-2 text-center sm:mx-2 sm:w-auto">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full sm:w-24 p-2 border border-gray-300 rounded-md text-sm text-center"
                  placeholder="Max"
                />
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
                  {/* Add margin-bottom for spacing */}
                  <div className="flex gap-2 mt-3 ml-1">
                    <img
                      loading="lazy"
                      src={product.images} // Display the first image
                      alt={product.name}
                      className="object-contain shrink-0 max-w-full aspect-square w-[80px]"
                    />
                    <div className="mt-3">
                      <span className="text-lg font-semibold leading-5 text-black">
                        {" "}
                        {/* Changed text-sm to text-lg */}
                        {product.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No top sellers available.</div>
            )}
          </div>
        </div>

        <div className="container bg-white">
          <div className="text-3xl font-bold mb-4 mt-2 ">PRODUCTS</div>

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
