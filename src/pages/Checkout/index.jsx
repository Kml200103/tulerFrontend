import React, { useState, useEffect, useCallback } from "react";
import CardItem from "./CheckoutCardItem";
import AddressForm from "../../components/AddressForm";
import { del, get, post } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import { NotificationService } from "../../services/Notifcation";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

const Checkout = () => {
  const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [cartData, setCartData] = useState({ items: [], totalPrice: 0 });
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isOfferAvailable, setIsOfferAvailable] = useState(false);
  const [formError, setFormError] = useState("");
  const [availableOffers, setAvailableOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offerError, setOfferError] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  // console.log(user);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    reset, // Import reset to clear the form after submission
  } = useForm({
    defaultValues: {
      fullName: user?.name || "", // Assuming 'name' corresponds to 'fullName'
      streetAddress: "", // This will be filled when an address is selected
      city: "", // This will be filled when an address is selected
      email: user?.email || "", // Assuming the user email is available
      state: "", // This will be filled when an address is selected
      country: "", // This will be filled when an address is selected
      phone: user?.phone || "", // Assuming the user phone is available
      id: "", // This can be used to store the address ID if needed
      pincode: "", // This will be filled when an address is selected
      addressType: "", // Optional: if you want to include address type
    },
  });
  const countries = [
    { value: "", label: "Select Country" },
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "India", label: "India" },
  ];
  const fetchCartData = useCallback(async () => {
    if (!userId) return;
    try {
      const { receiveObj } = await get(
        `/cart/${userId}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  }, [userId]);

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    try {
      const { receiveObj } = await get(
        `/address/${userId}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      const addresses = receiveObj.addresses || [];
      setPreviousAddresses(addresses);
      // Don't set a default selected address
      setSelectedAddress(null);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  }, [userId]);
  const fetchAvailableOffers = useCallback(async () => {
    const { receiveObj } = await get(
      "/offer",
      {},
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    setAvailableOffers(receiveObj.offers);
    const savedOffer = JSON.parse(localStorage.getItem("savedOffer"));
    if (savedOffer) {
      const offer = receiveObj.offers.find(
        (offer) => offer._id === savedOffer.id
      );
      if (offer) {
        setSelectedOffer(offer);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartData();
      fetchAddresses();
      fetchAvailableOffers();
    }
  }, [fetchCartData, fetchAddresses, fetchAvailableOffers]);

  useEffect(() => {
    const savedOffer = localStorage.getItem("savedOffer");
    if (savedOffer) {
      setIsOfferAvailable(true);
    }
  }, []);

  const removeAddress = async (address) => {
    try {
      const { receiveObj } = await del(
        `/address/${address._id}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      // console.log(receiveObj);

      // After successfully removing the address
      setPreviousAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => addr._id !== address._id)
      );

      // If the removed address was the selected address, clear the selection and reset the form
      if (selectedAddress && selectedAddress._id === address._id) {
        setSelectedAddress(null); // Clear the selected address
        reset(); // Reset the form fields
        clearErrors(); // Clear any validation errors
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error removing address:", error);
      NotificationService.sendErrorMessage("Failed to remove address.");
    }
  };

  const applyOffer = async () => {
    if (!selectedOffer) {
      setOfferError("Please select an offer to apply.");
      return;
    }

    if (
      selectedOffer.type === "fixed" &&
      cartData.totalPrice <= selectedOffer.value
    ) {
      setOfferError(
        `Offer of ${selectedOffer.option} cannot be applied as the total price is less than or equal to the discount.`
      );
      return;
    }

    setOfferError("");

    const payload = {
      totalPrice: cartData.totalPrice,
      offerId: selectedOffer._id,
    };

    try {
      const { receiveObj } = await post("/apply-discount", payload, {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      });
      if (receiveObj.success) {
        setDiscountedPrice(receiveObj.discountedPrice);
      }
    } catch (error) {
      console.error("Error applying offer:", error);
      setOfferError("Failed to apply the offer. Please try again.");
    }
  };

  const onSelectAddress = (address) => {
    setSelectedAddress(address);
    setValue("fullName", address.name || ""); // Autofill full name
    setValue("streetAddress", address.streetAddress || ""); // Autofill street address
    setValue("city", address.city || ""); // Autofill city
    setValue("state", address.state || ""); // Autofill state
    setValue("country", address.country || ""); // Autofill country
    setValue("pincode", address.pincode || ""); // Autofill pincode
    setValue("phone", user?.phone || ""); // Autofill phone if available
    setValue("addressType", address.addressType || "");
    clearErrors(); // Clear any previous errors
  };

  const placeOrder = async () => {
    // ("selectconsole.loged", selectedAddress);

    if (!selectedAddress) {
      NotificationService.sendErrorMessage("Please add address details");
      return; // Prevent order placement if no address is selected
    }

    // console.log("User ID:", userId);
    // console.log("Selected Address:", selectedAddress);
    // console.log("Cart Items:", cartData.items);

    if (!userId || cartData.items.length === 0) {
      NotificationService.sendErrorMessage(
        "Please ensure your cart is not empty."
      );
      return;
    }

    // Clear any previous error messages
    setFormError("");

    // Construct the payload using the specified structure
    const payload = {
      addressId: selectedAddress._id, // Use the selected address ID
      userId: userId,
      // Optionally include the discounted price if applicable
      totalPrice: discountedPrice ? discountedPrice : cartData.totalPrice,
    };

    // Add cart items to the payload
    payload.items = cartData.items.map((item) => ({
      variantId: item.variant._id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    // console.log("Payload:", payload);

    try {
      const response = await post("/order/create", payload, {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      });
      // console.log("API Response:", response);
      if (response.receiveObj.status) {
        window.location.href = response.receiveObj.session;
        localStorage.removeItem("savedOffer");
      } else {
        NotificationService.sendErrorMessage("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      NotificationService.sendErrorMessage(
        "Error placing order. Please try again."
      );
    }
  };
  const onSubmit = async (data) => {
    // Create a payload object, including 'name' instead of 'fullName' and excluding 'email'
    const payload = {
      name: data.fullName, // Use 'fullName' from the form data and rename it to 'name'
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      addressType: data.addressType,
      userId: userId, // Include userId
      // Exclude 'email' from the payload
    };

    // Log the payload for debugging
    // console.log(payload);

    // Construct the endpoint based on whether an ID is present
    const endpoint = data.id
      ? `/address/add/${userId}/${data.id}` // Update existing address
      : `/address/add/${userId}`; // Add new address

    try {
      // Make the API call
      const { receiveObj } = await post(endpoint, payload, {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      });
      if (receiveObj.success) {
        NotificationService.sendSuccessMessage(receiveObj.message);
        reset(); // Reset the form after successful submission
        fetchAddresses(); // Optionally refetch addresses to update the list
      } else {
        NotificationService.sendErrorMessage("Error processing the address.");
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      NotificationService.sendErrorMessage(
        "An error occurred while processing the address."
      );
    }
  };
  return (
    <div className="container flex flex-col pt-[72px] md:pt-[96px] mt-10 py-4 mx-auto w-full bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10">
        {/* Left Side: Address Form */}
        <div className="lg:col-span-3">
          <form
            className="bg-white px-3 py-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Full Name */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Full name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      id="full-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.fullName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2 flex gap-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        id="phone-number"
                        maxLength={10}
                        {...register("phone", {
                          required: "Phone Number is required",
                          validate: {
                            validLength: (value) =>
                              value.length === 10 ||
                              "Phone Number must be exactly 10 digits",
                            validStart: (value) =>
                              /^[6-9]/.test(value) ||
                              "Phone Number must start with 6, 7, 8, or 9",
                          },
                        })}
                        onInput={(e) => {
                          const target = e.target;
                          target.value = target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                        }}
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={user?.phone || ""}
                        disabled={!!user?.phone}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-2">
                          *{errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Country <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      id="country"
                      className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("country", {
                        required: "Country is required",
                      })}
                    >
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.country.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Street address <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="street-address"
                      {...register("streetAddress", {
                        required: "Street Address is required",
                      })}
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.streetAddress && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.streetAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    City <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="city"
                      {...register("city", { required: "City is required" })}
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    State <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="state"
                      {...register("state", { required: "State is required" })}
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.state && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ZIP / Postal Code */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    ZIP / Postal code <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="zipCode"
                      maxLength={6}
                      {...register("pincode", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Invalid Zip code",
                        },
                      })}
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-sm mt-2">
                        *{errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Type Checkbox */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Address Type
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="radio"
                      id="addressTypeHome"
                      {...register("addressType", {
                        required: "Address type is required",
                      })}
                      value="home"
                      className="mr-2"
                    />
                    <label
                      htmlFor="addressTypeHome"
                      className="text-sm text-gray-700"
                    >
                      Home
                    </label>

                    <input
                      type="radio"
                      id="addressTypeWork"
                      {...register("addressType", {
                        required: "Address type is required",
                      })}
                      value="office"
                      className="ml-4 mr-2"
                    />
                    <label
                      htmlFor="addressTypeWork"
                      className="text-sm text-gray-700"
                    >
                      Office
                    </label>
                  </div>
                  {errors.addressType && (
                    <p className="text-red-600 text-sm mt-2">
                      *{errors.addressType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="block w-1.2 justify-end rounded-md bg-yellow-500 px-3 py-1.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Add Address
              </button>
            </div>

            {previousAddresses.length > 0 && (
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold mt-6 leading-7 text-gray-900">
                  Existing Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose from Existing Address
                </p>
                <div className="max-h-60 overflow-y-auto">
                  {" "}
                  {/* Set max height and enable scrolling */}
                  <ul role="list" className="divide-y divide-gray-100">
                    {previousAddresses.map((address, index) => (
                      <li
                        key={index}
                        className="flex justify-between px-5 gap-x-6 py-5 border-solid border-2 border-gray-200"
                      >
                        <div className="flex min-w-0 gap-x-4">
                          <input
                            name="address"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-yellow-600 focus:ring-indigo-600"
                            checked={
                              selectedAddress &&
                              selectedAddress._id === address._id
                            }
                            onChange={() => onSelectAddress(address)}
                          />
                          <div className="min-w-0 flex-auto">
                            <p className="text-md font-semibold leading-6 text-gray-900">
                              {address.name}
                            </p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                              {address.streetAddress}
                            </p>
                            <p className="mt-1 truncate text-sm leading-5 text-gray-500">
                              {address.city}, {address.state}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.pincode}
                            </p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                              {address.addressType.charAt(0).toUpperCase() +
                                address.addressType.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-md leading-6 font-semibold text-gray-900">
                            {address.country}
                          </p>
                          <div className="mt-auto">
                            <button
                              onClick={() => removeAddress(address)}
                              className="mt-2 text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-2 mt-6">
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Order Summary
          </h2>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <ul role="list" className="divide-y divide-gray-200">
              {cartData.items && cartData.items.length > 0 ? (
                cartData.items.map((item, index) => (
                  <li key={index} className="flex items-center py-4">
                    <img
                      src={item.images || "default-image-url"}
                      alt={item.productName}
                      className="h-16 w-16 flex-none rounded-md border border-gray-200"
                    />
                    <div className="ml-4 flex-auto">
                      <h3 className="font-medium text-gray-900 text-sm">
                        <Link
                          to={`/product/description/${item.productName
                            .trim()
                            .replace(/\s+/g, "-")}/${item.productId}`} // Link to the product description page
                          className="hover:underline"
                        >
                          {item.productName}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {item.variant.weight}
                      </p>
                      <p className="text-gray-500 text-xs">
                        ${item.variant.price}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeItemFromCart({
                              userId: user?.id,
                              itemId: item.id,
                            })
                          )
                        }
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-xl font-semibold mt-2 mb-2 text-red-600 text-center">
                  Please Add Products to Checkout
                </div>
              )}
            </ul>

            {cartData.items && cartData.items.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                {/* Apply Offer Section */}
                {isOfferAvailable && selectedOffer && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold mr-2">
                        Available Offer
                      </h3>
                      <p className="text-gray-700 text-md font-bold">
                        {selectedOffer.option}
                      </p>
                    </div>
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={applyOffer}
                        className={`p-2 rounded text-yellow-500 transition duration-200 w-auto`} // Set width to auto
                        disabled={!!offerError}
                      >
                        Apply Offer
                      </button>
                    </div>
                    {offerError && (
                      <p className="text-red-500 mt-2">{offerError}</p>
                    )}
                  </div>
                )}

                {/* Subtotal Section */}
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${cartData.totalPrice.toFixed(2)}</p>
                </div>
                {discountedPrice !== null && (
                  <>
                    <div className="flex justify-between text-red-500">
                      <div>Discount Applied:</div>
                      <div>
                        -${(cartData.totalPrice - discountedPrice).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Discounted Price</div>
                      <div>${discountedPrice.toFixed(2)}</div>
                    </div>
                  </>
                )}
                <div className="mt-6 flex justify-center">
                  {" "}
                  {/* Center the button */}
                  <button
                    className="max-w-[406px] rounded-[30px] w-full bg-black" // Set background color here
                    onClick={placeOrder}
                    disabled={
                      !selectedAddress ||
                      formError !== "" ||
                      cartData.items.length === 0
                    }
                  >
                    <div className="flex justify-center gap-10 px-20 py-5">
                      {" "}
                      {/* Center the text */}
                      <span className="text-sm font-semibold text-yellow-400">
                        Pay and Order
                      </span>
                    </div>
                  </button>
                  {formError && (
                    <p className="text-red-600 mt-4">*{formError}</p>
                  )}
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <Link
                      href="/products"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
