import React, { useEffect, useState, useCallback } from "react";
import { del, get, put } from "../../services/http/axiosApi"; // Ensure you have a put method for updating
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router"; // Fixed import for react-router-dom
import {
  clearCart as clearCartAction,
  removeItem as removeItemAction,
  decreaseQuantity as decreaseQuantityAction,
  increaseQuantity as increaseQuantityAction, // Ensure this is imported
} from "../../redux/cart/cartSlice";

export default function Cart({ onClose }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [updating, setUpdating] = useState(false); // Prevent multiple API calls
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const id = user?.id;
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Fetch Cart Data
  const fetchCartData = useCallback(async () => {
    if (!id) {
      setCartData(cart);
      return;
    }
    try {
      const { receiveObj } = await get(
        `/cart/${id}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );

      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [id, cart]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const removeItem = useCallback(
    async (productId, weight) => {
      if (updating) return;
      setUpdating(true);

      if (!id) {
        // Handle guest cart using Redux
        dispatch(removeItemAction({ productId, weight }));
        setCartData((prev) => ({
          ...prev,
          items: prev.items.filter(
            (item) =>
              !(item.productId === productId && item.variant.weight === weight)
          ),
        }));
        setUpdating(false);
        return;
      }

      // API call for logged-in users
      try {
        const { receiveObj } = await del(
          "/cart/remove",
          {
            userId: id,
            productId,
            weight, // Use weight instead of variantId
          },
          { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        );

        if (receiveObj.status === 401) {
          NotificationService.sendErrorMessage(receiveObj.message);
        } else {
          setCartData((prev) => ({
            ...prev,
            items: prev.items.filter(
              (item) =>
                !(
                  item.productId === productId && item.variant.weight === weight
                )
            ),
          }));
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      } finally {
        setUpdating(false);
      }
    },
    [id, updating, dispatch]
  );
  const handleCardClick = (item) => {
    console.log(item);

    const productName = item.productName.trim().replace(/\s+/g, "-");

    navigate(`/product/description/${productName}/${item.productId}`);
  };

  const clearCart = useCallback(async () => {
    if (!id) {
      // Handle guest cart using Redux
      dispatch(clearCartAction());
      setCartData({ items: [], totalPrice: 0 });
      return;
    }

    setUpdating(true);
    try {
      const { receiveObj } = await del(
        `/cart/clear/${id}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );

      if (receiveObj.status === 401) {
        NotificationService.sendErrorMessage(receiveObj.message);
      }
      setCartData({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setUpdating(false);
    }
  }, [id, dispatch]);

  const updateQuantity = useCallback(
    async (productId, weight, change) => {
      if (updating) return; // Prevent multiple requests at the same time
      setUpdating(true);

      const currentItem = cartData?.items?.find(
        (item) => item.productId === productId && item.variant.weight === weight
      );

      if (!currentItem) {
        console.error("Item not found in cart");
        setUpdating(false);
        return;
      }

      const newQuantity = Math.max(currentItem.quantity + change, 1);

      if (!id) {
        // Handle guest user cart using Redux state
        if (change < 0) {
          dispatch(decreaseQuantityAction({ productId, weight }));
        } else {
          dispatch(increaseQuantityAction({ productId, weight }));
        }
        setCartData((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.productId === productId && item.variant.weight === weight
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
        setUpdating(false);
        return;
      }

      // API call for logged-in users
      try {
        const { receiveObj } = await put(
          "/cart/update",
          {
            userId: id,
            productId,
            weight, // Use weight instead of variantId
            quantity: newQuantity,
          },
          { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        );

        if (receiveObj?.status === 401) {
          NotificationService.sendErrorMessage(receiveObj.message);
        } else {
          await fetchCartData(); // Ensure cart updates after API call
        }
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      } finally {
        setUpdating(false);
      }
    },
    [id, updating, fetchCartData, cartData, dispatch]
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg overflow-hidden z-50 flex flex-col transition-transform duration-300 
      ${isCartOpen ? "open" : "closed"} 
      ${isFadingOut ? "fade-out" : ""}
      w-full xs:w-[85%] sm:w-[65%] md:w-[50%] lg:w-[400px]
      p-4 sm:p-6`}
    >
      <div className="flex items-center justify-between">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/620e45e22b9abd39329ae2f1db91b17636d8d6e35dcd110a32393670cecdbb08"
          alt="Cart Icon"
          className="object-contain w-8 sm:w-10"
        />

        <button
          onClick={() => {
            setIsFadingOut(true);
            onClose();
          }}
          className="text-xl sm:text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>

      {cartData?.items?.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
          disabled={updating}
        >
          Clear Cart
        </button>
      )}

      <div className="mt-4 sm:mt-6 w-full bg-neutral-200 h-[1px]" />

      <div className="overflow-y-auto flex-grow">
        {cartData?.items?.length > 0 ? (
          cartData.items.map((item) => (
            <div
              key={item._id}
              className="relative flex flex-col xs:flex-row gap-3 xs:gap-5 md:gap-7 items-center mt-6 sm:mt-8 mx-auto xs:ml-2 sm:ml-6 font-semibold w-full"
            >
              <button
                onClick={() => removeItem(item.productId, item.variant.weight)}
                className="absolute -top-4 right-1 xs:right-4 text-red-500 hover:text-red-600 text-xs sm:text-sm"
              >
                Remove
              </button>

              <div className="flex flex-row xs:flex-col items-center w-36 xs:w-12 sm:w-14 py-1 xs:py-2 bg-neutral-200 text-black rounded-3xl">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.variant.weight, 1)
                  }
                  className="w-full py-1 text-base sm:text-lg font-bold hover:bg-gray-300 rounded-l-3xl xs:rounded-l-none xs:rounded-t-3xl"
                  disabled={updating}
                >
                  +
                </button>
                <span className="px-4 xs:px-0 xs:py-2 text-base sm:text-lg font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.variant.weight, -1)
                  }
                  className="w-full py-1 text-base sm:text-lg font-bold hover:bg-gray-300 rounded-r-3xl xs:rounded-r-none xs:rounded-b-3xl"
                  disabled={updating}
                >
                  -
                </button>
              </div>

              <div
                className="flex flex-row gap-3 sm:gap-5 w-full xs:w-auto mt-3 xs:mt-0 items-center cursor-pointer" // Add cursor-pointer for visual feedback
                onClick={() => handleCardClick(item)} // Pass the item to the click handler
              >
                <img
                  loading="lazy"
                  src={item?.images || ""}
                  alt={item.productName || "Unknown Product"}
                  className="object-contain shrink-0 aspect-square rounded-[30px] sm:rounded-[50px] w-[50px] sm:w-[65px] md:w-[74px]"
                />

                <div className="flex flex-col text-xs sm:text-sm">
                  <div className="text-neutral-900 font-medium">
                    {item.productName}
                  </div>
                  <div className="text-gray-600 mt-1">
                    Price: ${item.totalPrice.toFixed(2) || ""}
                  </div>
                  <div className="text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </div>
                  <div className="text-gray-600 mt-1">
                    Weight: {item.variant.weight}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">Your Cart is Empty</p>
        )}
      </div>

      {cartData?.items?.length > 0 && id ? (
        <Link
          to="/checkout"
          className="py-2 sm:py-3 z-auto bg-black text-white rounded-xl px-3 sm:px-5 flex justify-between items-center mt-auto"
        >
          <span className="text-xs sm:text-sm font-semibold">Checkout</span>
          <span className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base font-bold bg-yellow-400 text-black rounded-xl">
            ${cartData?.totalPrice ? cartData.totalPrice.toFixed(2) : "0.00"}
          </span>
        </Link>
      ) : id ? (
        <p className="text-center text-gray-500 mt-4">
          Please add products to checkout.
        </p>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="text-center text-red-500 mt-4 py-2 w-full"
        >
          Please Login
        </button>
      )}
    </div>
  );
}
