import React, { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/53170dd3676b4a1a6be8852c858c8bacd448f290c0d0f526e2bd386531b16f6e?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    title: "Multi Flower Honey",
    priceRange: "$20",
    discount: "10%",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e206c5101ce081c236d4d04f08212424254cfb2311d78ee44b29281d556b3633?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    title: "Acacia Honey",
    priceRange: "$78",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0a6293df810ed9eb9fa42023a0b1074820a055d06f78488614074e8c9311ff7f?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    title: "Kashmir Black forest Honey",
    priceRange: "$23",
    discount: "10%",
  },
];

const Products = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100); // Set your max price according to your product range
  const [filteredProducts, setFilteredProducts] = useState(products); // Initialize with all products


  const handleChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = Math.max(0, Number(value)); // Prevent negative values

    if (name === "min") {
      setMinPrice(parsedValue > maxPrice ? maxPrice : parsedValue);
    } else {
      setMaxPrice(parsedValue < minPrice ? minPrice : parsedValue);
    }
  };
  // Function to filter products based on price range
  const applyFilter = () => {
    const newFilteredProducts = products.filter((product) => {
      const productPrice = parseFloat(product.priceRange.replace("$", ""));
      return productPrice >= minPrice && productPrice <= maxPrice;
    });
    setFilteredProducts(newFilteredProducts);
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
              <div className="self-start mt-4 text-2xl font-semibold leading-[32px] text-neutral-700">
                Filter by price
              </div>
              {/* <Slider
                value={[minPrice, maxPrice]}
                onChange={(event, newValue) => {
                  setMinPrice(Math.max(0, newValue[0])); // Prevent negative value
                  setMaxPrice(Math.max(0, newValue[1])); // Prevent negative value
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100} // Adjust this max value based on your product prices
                step={1}
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
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-neutral-600">
                  Price: ${minPrice} - ${maxPrice}
                </div>
                <div className="self-end text-sm font-medium text-black">
                  <button
                    className="bg-transparent text-black border-none px-4 py-2 rounded"
                    onClick={applyFilter}
                  >
                    Filter
                  </button>
                </div>
              </div> */}
              <div className="w-full max-w-md mx-auto">
                <div className="relative w-full h-2 bg-gray-300 rounded-full">
          
                  <div
                    className="absolute h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${(minPrice / 100) * 100}%`,
                      width: `${((maxPrice - minPrice) / 100) * 100}%`,
                    }}
                  ></div>

                  <input
                    type="range"
                    name="min"
                    min="0"
                    max="100"
                    value={minPrice}
                    onChange={handleChange}
                    className="absolute w-full h-2 opacity-0 cursor-pointer"
                    style={{ zIndex: 1 }}
                  />

                  {/* Max Price Thumb */}
                  <input
                    type="range"
                    name="max"
                    min="0"
                    max="100"
                    value={maxPrice}
                    onChange={handleChange}
                    className="absolute w-full h-2 opacity-0 cursor-pointer"
                    style={{ zIndex: 1 }}
                  />
                </div>

                {/* Price Display & Filter Button */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Price: ${minPrice} - ${maxPrice}
                  </div>
                  <button
                    className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
                    onClick={applyFilter}
                  >
                    Filter
                  </button>
                </div>
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
        <div className="flex flex-col w-3/4 p-4 max-md:w-full">
          <div className="flex gap-5 max-md:flex-col max-md:mt-5 max-md:max-w-full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, idx) => (
                <div
                  className={`flex flex-col ${idx !== 0 && "ml-2"
                    } w-[30%] max-md:ml-0 max-md:w-full mb-5`}
                  key={idx}
                >
                  <ProductCard
                    imageSrc={product.imageSrc}
                    title={product.title}
                    priceRange={product.priceRange}
                    discount={product.discount}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center text-lg text-red-600">
                  No products found for the selected price range.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
