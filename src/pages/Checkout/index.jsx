import React, { useState, useEffect, useCallback } from "react";
import CardItem from "./CheckoutCardItem";
import AddressForm from "../../components/AddressForm";
import { get, post } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import { NotificationService } from "../../services/Notifcation";

const Checkout = () => {
  const [showPreviousAddresses, setShowPreviousAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [cartData, setCartData] = useState({ items: [], totalPrice: 0 });

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

  useEffect(() => {
    if (userId) {
      fetchCartData();
      fetchAddresses();
    }
  }, [fetchCartData, fetchAddresses]);

  const handleChangeAddressClick = () => {
    setShowPreviousAddresses(true);
  };

  const handleCloseDialog = () => {
    setShowPreviousAddresses(false);
  };

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
  };

  const placeOrder = async () => {
    if (!userId || !selectedAddress || cartData.items.length === 0) {
      alert("Please select an address and ensure your cart is not empty.");
      return;
    }

    const payload = {
      userId,
      addressId: selectedAddress._id, // Address ID from selected address
      items: cartData?.items.map((item) => {
        console.log('item', item)
        return (
          {
            variantId: item.variant._id,
            productId: item.productId, // Ensure it's the correct product ID
            quantity: item.quantity,
          }
        )
      }),
      totalPrice: cartData.totalPrice,
    };

    try {
      const response = await post("/order/create", payload); // Assuming `post` is your Axios service function
      if (response.receiveObj.status === true) {
        NotificationService.sendSuccessMessage("Order placed successfully!");
      } else {
        NotificationService.sendErrorMessage("Failed to place order");
      }
    } catch {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="container flex flex-col py-4 mx-auto w-full bg-white min-h-screen">
      <div className="flex gap-5 justify-between items-center w-full text-sm">
        <div className="flex flex-col w-full text-black">
          <div className="text-neutral-700">Deliver to: <b>{selectedAddress?.name}</b></div>
          <div className="leading-5 text-neutral-600">
            {selectedAddress
              ?
              `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.pincode}`
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
            {" "}
            {/* Increased width and height */}
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
                        ? `${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
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
            {/* const { name, images, variants } = productId; */ }
            const { weight, price } = item?.variant
            {/* const firstVariant = variants?.[0] || {}; */ }
            return (
              <CardItem
                key={index}
                imgSrc={images?.[0] || "default-image-url"}
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
      {cartData.items.length > 0 && (
        <div className="flex gap-5 justify-between mt-4 w-full text-sm font-bold leading-none text-neutral-700 px-8">
          <div>Total Amount</div>
          <div>${cartData.totalPrice.toFixed(2)}</div>
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
