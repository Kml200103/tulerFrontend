import React, { useEffect, useState, useCallback } from "react";
import { del, get, put } from "../../services/http/axiosApi"; // Ensure you have a put method for updating
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router"; // Fixed import for react-router-dom
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
  const navigate = useNavigate()
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
    
      // Accept variantId as a parameter
      if (updating) return;
      setUpdating(true);

      if (!id) {
        // Dispatch the removeItem action if userId is not present
        dispatch(removeItemAction({ productId, weight })); // Pass both productId and variantId
        setCartData((prev) => ({
          ...prev,
          items: prev.items.filter(
            (item) =>
              !(item.productId === productId || item.variant.weight === weight) // Ensure both IDs are checked
          ),
        }));
        setUpdating(false);
        return;
      }

      try {
        const { receiveObj } = await del(
          "/cart/remove",
          {
            userId: id,
            productId,
            weight, // Include variantId in the API call
          },
          { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        );

        if (receiveObj.status === 401) {
          NotificationService.sendErrorMessage(receiveObj.message);
        } else {
          // Only update the local state if the API call was successful
          setCartData((prev) => ({
            ...prev,
            items: prev.items.filter(
              (item) =>
                !(item.productId === productId || item.variant.weight === weight) // Ensure both IDs are checked
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

  const clearCart = useCallback(async () => {
    if (!id) {
      // Dispatch the clearCart action if userId is not present
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
      // Accept variantId as a parameter
      if (updating) return; // Prevent multiple requests at the same time
      setUpdating(true);

      const currentItem = cartData?.items?.find(
        (item) => item.productId === productId && item.variant.weight === weight // Check for both productId and variantId
      );

      if (!currentItem) {
        console.error("Item not found in cart");
        setUpdating(false);
        return;
      }

      const newQuantity = Math.max(currentItem.quantity + change, 1);

      if (!id) {
        // Dispatch the decreaseQuantity or increaseQuantity action based on the change
        if (change < 0) {
          dispatch(decreaseQuantityAction({ productId, weight })); // Pass both productId and variantId
        } else {
          dispatch(increaseQuantityAction({ productId, weight })); // Pass both productId and variantId
        }
        // Update local state to reflect the change immediately
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

      try {
        const { receiveObj } = await put(
          "/cart/update",
          {
            userId: id,
            productId,
            weight, // Include variantId in the API call
            quantity: newQuantity, // Send updated quantity to API
          },
          { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        );
        if (receiveObj.status === 401) {
          NotificationService.sendErrorMessage(receiveObj.message);
        }
        // Refresh cart after update
        await fetchCartData();
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
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg p-6 overflow-hidden z-50 flex flex-col transition-transform duration-300 ${isCartOpen ? "open" : "closed"
        } ${isFadingOut ? "fade-out" : ""}`}
    >
      <div className="flex items-center justify-between">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/620e45e22b9abd39329ae2f1db91b17636d8d6e35dcd110a32393670cecdbb08"
          alt="Cart Icon"
          className="object-contain w-10"
        />

        <button
          onClick={() => {
            setIsFadingOut(true);
            onClose();
          }}
          className="text-2xl font-bold text-gray-500 hover:text-gray-800"
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

      <div className="mt-6 w-full bg-neutral-200 h-[1px]" />

      <div className="overflow-y-auto flex-grow">
        {cartData?.items?.length > 0 ? (
          cartData.items.map((item) => {
            // Remove the extra curly braces here
            return (
              <div
                key={item._id}
                className="relative flex gap-7 items-center mt-8 ml-6 font-semibold"
              >
                <button
                  onClick={() => removeItem(item.productId, item.variant.weight)} // Pass variantId
                  className="absolute -top-4 right-4 text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>

                <div className="flex flex-col items-center w-14 py-2 bg-neutral-200 text-black rounded-3xl">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.variant.weight, 1)
                    } // Pass variantId
                    className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-t-3xl"
                    disabled={updating}
                  >
                    +
                  </button>
                  <span className="py-2 text-lg font-semibold">
                    {item.quantity}{" "}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.variant.weight, -1)
                    } // Pass variantId
                    className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-b-3xl"
                    disabled={updating}
                  >
                    -
                  </button>
                </div>
                <img
                  loading="lazy"
                  src={item?.images || ""}
                  alt={item.productName || "Unknown Product"}
                  className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[50px] w-[74px]"
                />

                <div className="flex flex-col self-stretch my-auto text-sm">
                  <div className="text-neutral-900">{item.productName}</div>
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
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-4">Your Cart is Empty</p>
        )}
      </div>

      {cartData?.items?.length > 0 && id ? (
        <Link
          to="/checkout"
          className="py-3 bg-black text-white rounded-xl px-5 flex justify-between items-center mt-auto"
        >
          <span className="text-sm font-semibold">Checkout</span>
          <span className="px-5 py-2.5 text-base font-bold bg-yellow-400 text-black rounded-xl">
            ${cartData?.totalPrice ? cartData.totalPrice.toFixed(2) : "0.00"}
          </span>
        </Link>
      ) : id ? (
        // If user is logged in but cart is empty
        <p className="text-center text-gray-500 mt-4">
          Please add products to checkout.
        </p>
      ) : (
        // If user is not logged in
        <button
          onClick={() => navigate("/login")}
          className="text-center text-red-500 mt-4"
        >
          Please Login
        </button>
      )}
    </div>
  );
}
