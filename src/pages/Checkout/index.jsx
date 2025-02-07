// import React, { useState } from "react";
// import CardItem from "./CheckoutCardItem";

// const items = [
//   {
//     imgSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/1e820973b076995384d562e9a8e7a063f15e6781cc0f074f223a98a879bd4d7d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     imgAlt: "Acacia Honey",
//     description: "Acacia Honey, 100% Pure & Natural (320g)",
//     oldPrice: "$19.25",
//     discountedPrice: "$16.65",
//     discount: "11% off",
//   },
//   {
//     imgSrc:
//       "https://cdn.builder.io/api/v1/image/assets/TEMP/8d51a66f17e971d903df7388f479dd98caddf7e8c28a2366bcb67ff8c010cb5a?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
//     imgAlt: "Kashmiri Forest Honey",
//     description: "Kashmiri Forest Honey, 100% Pure & Natural (500g)",
//     oldPrice: "$19.25",
//     discountedPrice: "$16.65",
//     discount: "11% off",
//   },
// ];
// const Checkout = () => {
//   const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
//   const previousAddresses = [
//     "1234 Elm St, Springfield, IL, USA",
//     "5678 Oak St, Chicago, IL, USA",
//     "9101 Maple Ave, New York, NY, USA",
//   ];
//   return (
//     <div className="container flex flex-col py-4 mx-auto w-full bg-white min-h-screen">
//       <div className="flex gap-5 justify-between items-center  w-full text-sm">
//         <div className="flex flex-col w-full text-black">
//           <div className="text-neutral-700">
//             Deliver to:{" "}
//             <span className="font-semibold text-black">
//               Paris Keeling, 90703
//             </span>
//           </div>
//           <div className="leading-5 text-neutral-600">
//             12601 Town Center Dr Cerritos, California,
//             <br />
//             United States
//           </div>
//         </div>
//         <div className="my-auto font-semibold leading-none text-red-400 cursor-pointer">
//           Change
//         </div>
//       </div>

//       <div className="flex gap-5 justify-between px-7 py-5 mt-6 w-full bg-stone-50">
//         <div className="flex gap-2.5">
//           <div className="flex flex-col justify-center items-center px-1 bg-yellow-400 rounded-md h-[21px] w-[21px]">
//             <img
//               src="https://cdn.builder.io/api/v1/image/assets/TEMP/75a51782edb261735d24fed166a6e42b6ef958b99557b5a73724202c823552c9?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
//               alt=""
//               className="object-contain w-3 aspect-square"
//               loading="lazy"
//             />
//           </div>
//           <div className="text-sm font-semibold leading-loose basis-auto text-neutral-700">
//             1/1 ITEMS SELECTED
//           </div>
//           <div className="text-sm font-semibold leading-loose text-red-400">
//             ($36.95)
//           </div>
//         </div>
//         <div className="flex gap-2 self-start">
//           <img
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/6424f819a7956af4da38ba5c8b1c41c1d15e749cf18166e0b51d8fea213d3ec5?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
//             alt=""
//             className="object-contain shrink-0 w-5 aspect-square"
//             loading="lazy"
//           />
//           <img
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/f6dad4d3ab75181ac134cea9808775772987cdba9dfbd07032c7246da170e9ad?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
//             alt=""
//             className="object-contain shrink-0 w-5 aspect-square"
//             loading="lazy"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col items-start pr-20 pl-7 mt-7 w-full text-sm font-semibold">
//         {items.map((item, index) => (
//           <CardItem
//             key={index}
//             imgSrc={item.imgSrc}
//             imgAlt={item.imgAlt}
//             description={item.description}
//             oldPrice={item.oldPrice}
//             discountedPrice={item.discountedPrice}
//             discount={item.discount}
//           />
//         ))}
//       </div>

//       <div className="flex mt-10 w-full bg-stone-50 min-h-[1px]" />

//       <div className="self-start mt-4 ml-9 text-xs font-semibold leading-loose text-neutral-700">
//         PRICE DETAILS (2 ITEMS)
//       </div>

//       <div className="flex mt-3 w-full bg-stone-50 min-h-[1px]" />

//       <div className="flex gap-5 justify-between mt-6 w-full px-8 text-sm font-medium leading-loose text-neutral-700">
//         <div className="flex flex-col items-start">
//           <div>Total MRP</div>
//           <div className="mt-2.5">Coupon Discount</div>
//           <div className="mt-7 text-xs leading-5 text-zinc-500">
//             Free shipping for Tuler Insiders
//           </div>
//         </div>
//         <div className="flex flex-col items-start self-start whitespace-nowrap">
//           <div className="self-stretch">$40.25</div>
//           <div className="mt-2.5">-20%</div>
//           <div className="mt-2.5 text-red-400">FREE</div>
//         </div>
//       </div>

//       <div className="flex mt-5 w-full bg-stone-50 min-h-[1px]" />

//       <div className="flex gap-5 justify-between mt-4 w-full text-sm font-bold leading-none text-neutral-700 px-8">
//         <div>Total Amount</div>
//         <div>$36.95</div>
//       </div>

//       <div className="flex mt-3.5 w-full bg-stone-50 min-h-[1px]" />

//       <div className="flex mt-3.5 w-full bg-stone-50 min-h-[1px]" />

//       <div
//         className="flex justify-center items-center gap-10 px-20 py-5 mt-10 max-w-full bg-black rounded-[30px] w-full sm:w-[406px] mx-auto"
//         role="button"
//         tabindex="0"
//       >
//         <div className="text-sm font-semibold text-center text-yellow-400">
//           Place Order
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState } from "react";
import CardItem from "./CheckoutCardItem";

const items = [
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1e820973b076995384d562e9a8e7a063f15e6781cc0f074f223a98a879bd4d7d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imgAlt: "Acacia Honey",
    description: "Acacia Honey, 100% Pure & Natural (320g)",
    oldPrice: "$19.25",
    discountedPrice: "$16.65",
    discount: "11% off",
  },
  {
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8d51a66f17e971d903df7388f479dd98caddf7e8c28a2366bcb67ff8c010cb5a?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47",
    imgAlt: "Kashmiri Forest Honey",
    description: "Kashmiri Forest Honey, 100% Pure & Natural (500g)",
    oldPrice: "$19.25",
    discountedPrice: "$16.65",
    discount: "11% off",
  },
];

const Checkout = () => {
  const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const previousAddresses = [
    "1234 Elm St, Springfield, IL, USA",
    "5678 Oak St, Chicago, IL, USA",
    "9101 Maple Ave, New York, NY, USA",
  ];

  const handleChangeAddressClick = () => {
    setShowPreviousAddresses(true);
  };

  const handleCloseDialog = () => {
    setShowPreviousAddresses(false);
  };

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
  };

  return (
    <div className="container flex flex-col py-4 mx-auto w-full bg-white min-h-screen">
      <div className="flex gap-5 justify-between items-center  w-full text-sm">
        <div className="flex flex-col w-full text-black">
          <div className="text-neutral-700">
            Deliver to:{" "}
            <span className="font-semibold text-black">
              Paris Keeling, 90703
            </span>
          </div>
          <div className="leading-5 text-neutral-600">
            12601 Town Center Dr Cerritos, California,
            <br />
            United States
          </div>
        </div>
        <div
          className="my-auto font-semibold leading-none text-red-400 cursor-pointer"
          onClick={handleChangeAddressClick}
        >
          Change
        </div>
      </div>

      {showPreviousAddresses && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] h-auto max-h-[80vh] relative flex flex-col shadow-lg transition-transform transform scale-100 hover:scale-105">
            {/* Close Button (Cross) */}
            <button
              onClick={handleCloseDialog}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Select Your Address
            </h2>
            {/* Address List */}
            <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
              {previousAddresses.length > 0 ? (
                previousAddresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center mb-3 p-2 rounded hover:bg-blue-50 transition duration-200"
                  >
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="address"
                      value={address}
                      checked={selectedAddress === address}
                      onChange={() => setSelectedAddress(address)}
                      className="mr-3 accent-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`address-${index}`}
                      className="text-gray-700 text-lg cursor-pointer"
                    >
                      {address}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No previous addresses available.
                </p>
              )}
            </div>

            {/* Separator */}
            {showAddAddressForm ? <hr className="my-4 border-gray-300" /> : ""}

            {/* "Add New Address" or "Cancel" button (Right aligned) */}
            <div className="flex justify-end mt-4">
              {showAddAddressForm ? (
                <button
                  className="text-red-500 hover:text-red-700 hover:underline"
                  onClick={() => setShowAddAddressForm(false)}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                  onClick={handleAddAddressClick}
                >
                  Add New Address
                </button>
              )}
            </div>

            {/* Add Address Form */}
            {showAddAddressForm && (
              <div className="mt-4">
                <h2 className="text-center font-semibold text-xl ">
                  Add Address
                </h2>
                <div className="mb-2">Name</div>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-1/2 p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    type="text"
                    placeholder="Enter Street"
                    className="w-1/2 p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <div className="mb-2">City</div>
                    <input
                      type="text"
                      placeholder="Enter City"
                      className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-2">State</div>
                    <input
                      type="text"
                      placeholder="Enter State"
                      className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <div className="mb-2">Country</div>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="mb-2">Pincode</div>
                    <input
                      type="text"
                      placeholder="Enter Pincode"
                      className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* "Add Address" Button */}
                <div className="flex justify-end mt-4">
                  <button className="text-blue-500 hover:text-blue-700 hover:underline">
                    Add Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Listing */}
      <div className="flex flex-col items-start pr-20 pl-7 mt-7 w-full text-sm font-semibold">
        {items.map((item, index) => (
          <CardItem
            key={index}
            imgSrc={item.imgSrc}
            imgAlt={item.imgAlt}
            description={item.description}
            oldPrice={item.oldPrice}
            discountedPrice={item.discountedPrice}
            discount={item.discount}
          />
        ))}
      </div>

      {/* Price Details, Place Order, etc. */}
      <div className="flex mt-10 w-full bg-stone-50 min-h-[1px]" />
      <div className="self-start mt-4 ml-9 text-xs font-semibold leading-loose text-neutral-700">
        PRICE DETAILS (2 ITEMS)
      </div>

      {/* Order Summary and Place Order */}
      <div className="flex mt-5 w-full bg-stone-50 min-h-[1px]" />
      <div className="flex gap-5 justify-between mt-6 w-full px-8 text-sm font-medium leading-loose text-neutral-700">
        <div className="flex flex-col items-start">
          <div>Total MRP</div>
          <div className="mt-2.5">Coupon Discount</div>
          <div className="mt-7 text-xs leading-5 text-zinc-500">
            Free shipping for Tuler Insiders
          </div>
        </div>
        <div className="flex flex-col items-start self-start whitespace-nowrap">
          <div className="self-stretch">$40.25</div>
          <div className="mt-2.5">-20%</div>
          <div className="mt-2.5 text-red-400">FREE</div>
        </div>
      </div>

      <div className="flex mt-5 w-full bg-stone-50 min-h-[1px]" />

      <div className="flex gap-5 justify-between mt-4 w-full text-sm font-bold leading-none text-neutral-700 px-8">
        <div>Total Amount</div>
        <div>$36.95</div>
      </div>

      <div className="flex mt-3.5 w-full bg-stone-50 min-h-[1px]" />

      <div
        className="flex justify-center items-center gap-10 px-20 py-5 mt-10 max-w-full bg-black rounded-[30px] w-full sm:w-[406px] mx-auto"
        role="button"
        tabindex="0"
      >
        <div className="text-sm font-semibold text-center text-yellow-400">
          Place Order
        </div>
      </div>
    </div>
  );
};

export default Checkout;
