import React, { useState, useEffect, useMemo, useCallback } from "react";
import ProductCard from "./ProductCard";
import { get } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";

const circleButtons = [{ key: "start" }, { key: "end" }];

const Products = () => {
  const [products, setProducts] = useState([]); // Store API products
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Adjust based on product range
  const [isLoading, setIsLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null);
  // const { id } = useSelector((state) => state.auth.user);
  // Fetch products from API only once
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await get("/products"); // Replace with actual API
        // const data = await response.json();
        console.log("response", response);
        if (response.isSuccess) {
          setProducts(response?.receiveObj?.products);
        } else {
          throw new Error("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Debounce function to avoid frequent filtering
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Memoized filter function to avoid recalculating on every re-render
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const minVariantPrice = Math.min(...product.variants.map((v) => v.price));
      return minVariantPrice >= minPrice && minVariantPrice <= maxPrice;
    });
  }, [products, minPrice, maxPrice]);

  // Handle price input changes with debounce
  const handleChange = useCallback(
    debounce((event) => {
      const { name, value } = event.target;
      const parsedValue = Math.max(0, Number(value)); // Prevent negative values

      if (name === "min") {
        setMinPrice(parsedValue > maxPrice ? maxPrice : parsedValue);
      } else {
        setMaxPrice(parsedValue < minPrice ? minPrice : parsedValue);
      }
    }, 300), // 300ms debounce delay
    [minPrice, maxPrice]
  );

  console.log("filtered", filteredProducts);

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
            <div className="flex-auto my-auto text-xs">
              Showing 1 - {filteredProducts.length} of {products.length} item(s)
            </div>
            <div className="flex gap-2 px-2 py-2 text-sm font-semibold bg-neutral-200">
              <div>SORT BY</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c2ae2d0d1344eee9754786ab04249477cc25d0d914353e3c63323d54ea86a8d1?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                alt="Sort Icon"
                className="object-contain shrink-0 my-auto w-4 aspect-[1.6]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[1385px] max-md:flex-col">
        {/* Sidebar Section */}

        <div className="flex flex-col w-1/4 p-4 mt-5 bg-sky-50 border border-sky-50 border-solid rounded-[20px] max-md:w-full  ">
          <div className="flex flex-col px-4 w-full max-md:px-2">
            <div className="text-2xl font-semibold leading-[32px] text-neutral-700">
              Product categories
            </div>
            <div className="mt-2 text-lg font-medium leading-[32px] text-neutral-700 max-md:mr-2.5 max-md:ml-1">
              Healing Ointments (10)
              <br />
              Health & Nutrition (6)
              <br />
              Honey (6)
              <br />
              Specials (9)
              <br />
              Uncategorized (0)
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
            {/* <div className="max-md:ml-1.5">Price: $60 — $540</div> */}
            <div className="mt-4 text-2xl font-semibold leading-[32px] max-md:mt-5">
              Top Sellers
            </div>
            <div className="flex gap-2 mt-1 ml-1">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2cebb2e00d5a66e0057449add526ddbdcaff8159acc4dd1d46cf9fc344b548d3?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                alt="Top Seller 1"
                className="object-contain shrink-0 max-w-full aspect-square w-[80px]"
              />
              <div className="mt-3">
                <span className="text-sm font-semibold leading-5 text-black">
                  Multi Flower Honey
                </span>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/97b51f76976f99691933407049080049f96ab06a2ff355a992be3a855cfe22d8?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt=""
              className="object-contain self-stretch mt-2 w-full aspect-[333.33] max-md:ml-0.5"
            />
            <div className="flex gap-2 mt-2 ml-1">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b53c6bccb5f91ef4bfcba4e6008565dfbe36468ae0216637828f69eaf582f05?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                alt="Top Seller 2"
                className="object-contain shrink-0 max-w-full aspect-square w-[80px]"
              />
              <div className="mt-3">
                <span className="text-sm font-semibold leading-5 text-black">
                  Acacia Honey
                </span>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/97b51f76976f99691933407049080049f96ab06a2ff355a992be3a855cfe22d8?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
              alt=""
              className="object-contain self-stretch mt-2 w-full aspect-[333.33] max-md:ml-0.5"
            />
            <div className="flex gap-2 mt-2 ml-1 max-md:ml-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bf69b3a45408eb1744c2c02549383cbc7f91aada9d424d98cc6df836ba3c9d6b?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
                alt="Top Seller 3"
                className="object-contain shrink-0 max-w-full aspect-square w-[80px]"
              />
              <div className="mt-3">
                <span className="text-sm font-semibold leading-5 text-black">
                  Black Forest Honey
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product List Section */}
        {/* <div className="flex flex-col w-3/4 p-4 max-md:w-full"> */}
        {/* Price Filter Inputs */}
        <div className="container bg-white">
          <div className="text-3xl font-bold mb-4">PRODUCTS</div>

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} userId={id} product={product} />
            ))}
          </div>
        </div>

        {/* Handle Loading & Error States */}
        {/* {isLoading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex gap-5 max-md:flex-col max-md:mt-5 max-md:max-w-full">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    className="flex flex-col w-[30%] max-md:w-full mb-5"
                    key={product._id}
                  >
                    <ProductCard
                      imageSrc={product.images[0]}
                      title={product.name}
                      priceRange={`$${Math.min(...product.variants.map((v) => v.price))}`} // Show lowest price
                      discount="10%" // Add dynamic discount if needed
                    />
                  </div>
                ))
              ) : (
                <p>No products found in this range.</p>
              )}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Products;
