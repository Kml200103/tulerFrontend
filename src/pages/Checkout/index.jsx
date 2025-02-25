import React, { useState, useEffect, useCallback } from "react";
import CardItem from "./CheckoutCardItem";
import AddressForm from "../../components/AddressForm";
import { get, post } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import { NotificationService } from "../../services/Notifcation";
import { useNavigate } from "react-router";

const Checkout = () => {
  const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [cartData, setCartData] = useState({ items: [], totalPrice: 0 });
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isOfferAvailable, setIsOfferAvailable] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]); // State for available offers
  const [selectedOffer, setSelectedOffer] = useState(null); // State for selected offer
  const [offerError, setOfferError] = useState(""); // State for offer error message
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const fetchCartData = useCallback(async () => {
    if (!userId) return;
    try {
      const { receiveObj } = await get(`/cart/${userId}`);
      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  }, [userId]);

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    try {
      const { receiveObj } = await get(`/address/${userId}`);
      const addresses = receiveObj.addresses || [];
      setPreviousAddresses(addresses);
      setSelectedAddress(addresses.length > 0 ? addresses[0] : null);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  }, [userId]);

  const fetchAvailableOffers = useCallback(async () => {
    const { receiveObj } = await get("/offer");
    setAvailableOffers(receiveObj.offers);

    // Check if the saved offer exists in the fetched offers
    const savedOffer = JSON.parse(localStorage.getItem("savedOffer"));
    if (savedOffer) {
      const offer = receiveObj.offers.find(
        (offer) => offer._id === savedOffer.id
      );

      if (offer) {
        setSelectedOffer(offer); // Set the saved offer as selected if it exists
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartData();
      fetchAddresses();
      fetchAvailableOffers(); // Fetch available offers
    }
  }, [fetchCartData, fetchAddresses, fetchAvailableOffers]);

  useEffect(() => {
    const savedOffer = localStorage.getItem("savedOffer");
    if (savedOffer) {
      setIsOfferAvailable(true);
    }
  }, []);
  const handleChangeAddressClick = () => {
    setShowPreviousAddresses(true);
  };

  const handleCloseDialog = () => {
    setShowPreviousAddresses(false);
  };

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
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
      return; // Exit the function if the offer cannot be applied
    }

    setOfferError(""); // Clear any previous error

    // Prepare the payload for the API request
    const payload = {
      totalPrice: cartData.totalPrice,
      offerId: selectedOffer._id,
    };

    try {
      // Make the API call to apply the discount
      const { receiveObj } = await post("/apply-discount", payload);

      if (receiveObj.success == true) {
        setDiscountedPrice(receiveObj.discountedPrice);
      }
    } catch (error) {
      console.error("Error applying offer:", error);
      setOfferError("Failed to apply the offer. Please try again.");
    }
  };

  const placeOrder = async () => {
    if (!userId || !selectedAddress || cartData.items.length === 0) {
      alert("Please select an address and ensure your cart is not empty.");
      return;
    }

    const payload = {
      userId,
      addressId: selectedAddress._id, // Address ID from selected address
      items: cartData?.items.map((item) => ({
        variantId: item.variant._id,
        productId: item.productId, // Ensure it's the correct product ID
        quantity: item.quantity,
      })),
      totalPrice: discountedPrice ? discountedPrice : cartData.totalPrice,
      offerId: selectedOffer ? selectedOffer._id : null, // Include selected offer ID
    };

    try {
      const response = await post("/order/create", payload);
      if (response.receiveObj.status === true) {
        // NotificationService.sendSuccessMessage("Order placed successfully!");

        // Redirect user to the Stripe checkout session
        window.location.href = response.receiveObj.session;

        // Clear saved offer after redirection
        localStorage.removeItem("savedOffer");
      } else {
        NotificationService.sendErrorMessage("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="container flex flex-col pt-[72px] md:pt-[96px] mt-10 py-4 mx-auto w-full bg-white min-h-screen">
      <div className="flex gap-5 justify-between items-center w-full text-sm">
        <div className="flex flex-col w-full text-black">
          <div className="text-neutral-700">
            Deliver to: <b>{selectedAddress?.name}</b>
          </div>
          <div className="leading-5 text-neutral-600">
            {selectedAddress
              ? `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.pincode}`
              : "No address selected"}
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
          <div className="bg-white p-6 rounded-lg w-[1000px] h-auto max-h-[90vh] relative flex flex-col shadow-lg">
            <button
              onClick={handleCloseDialog}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Select Your Address
            </h2>
            <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
              {previousAddresses.length > 0 ? (
                previousAddresses.map((address, index) => (
                  <div
                    key={address._id || index}
                    className="flex items-center mb-3 p-2 rounded hover:bg-blue-50 transition duration-200"
                  >
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="address"
                      value={address._id}
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                      className="mr-3 accent-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`address-${index}`}
                      className="text-gray-700 text-lg cursor-pointer"
                    >
                      {address
                        ? `${address.name}, ${address.streetAddress}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
                        : "No address selected"}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No previous addresses available.
                </p>
              )}
            </div>
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
            {showAddAddressForm && <AddressForm title="Add" button="Add" />}
          </div>
        </div>
      )}
      <div className="flex flex-col items-start px-7 mt-7 w-full text-sm font-semibold">
        {cartData.items.length > 0 ? (
          cartData.items.map((item, index) => {
            const { productId, quantity, productName, images } = item;
            const { weight, price } = item?.variant;

            return (
              <CardItem
                key={index}
                imgSrc={images || "default-image-url"}
                imgAlt={productName}
                description={`${productName} - ${weight}`}
                oldPrice={`$${(price * 1.2).toFixed(2)}`}
                discountedPrice={`$${price}`}
                discount="20% off"
                quantity={quantity}
              />
            );
          })
        ) : (
          <p className="text-gray-500 text-lg">
            Please add products to place an order.
          </p>
        )}
      </div>
      {isOfferAvailable && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Available Offer</h3>
          <div className="flex flex-col mt-2">
            <select
              value={selectedOffer ? selectedOffer._id : ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const offer = availableOffers.find(
                  (offer) => offer._id === selectedValue
                );
                setSelectedOffer(offer);
                setOfferError(""); // Clear any previous error
              }}
              className="p-2 border rounded"
            >
              <option value="" disabled>
                Select an offer
              </option>
              {availableOffers.map((offer) => {
                // Check if the offer is the selected offer
                const isSelectedOffer =
                  selectedOffer && offer._id === selectedOffer._id;

                // Disable all offers except the selected one
                const isDisabled = !isSelectedOffer;

                return (
                  <option
                    key={offer._id}
                    value={offer._id}
                    disabled={isDisabled}
                  >
                    {offer.option}
                  </option>
                );
              })}
            </select>
            {offerError && <p className="text-red-500 mt-2">{offerError}</p>}
            <button
              onClick={applyOffer}
              className={`mt-2 p-2 rounded text-blue-500 hover:underline transition duration-200 w-auto`} // Set width to auto
              disabled={!!offerError}
            >
              Apply Offer
            </button>
          </div>
        </div>
      )}
      {cartData.items.length > 0 && (
        <div className="flex flex-col gap-5 mt-4 w-full text-sm font-bold leading-none text-neutral-700 px-8">
          <div className="flex justify-between">
            <div>Total Amount</div>
            <div>${cartData.totalPrice.toFixed(2)}</div>
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
        </div>
      )}
      {cartData.items.length > 0 ? (
        <div
          className="flex justify-center items-center gap-10 px-20 py-5 mt-10 max-w-full bg-black rounded-[30px] w-full sm:w-[406px] mx-auto cursor-pointer"
          role="button"
          tabIndex="0"
          onClick={placeOrder}
        >
          <div className="text-sm font-semibold text-center text-yellow-400">
            Place Order
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Checkout;
