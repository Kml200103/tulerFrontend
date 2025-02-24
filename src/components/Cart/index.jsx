import React, { useEffect, useState, useCallback } from "react";
import { del, get, put } from "../../services/http/axiosApi"; // Ensure you have a put method for updating
import { useSelector } from "react-redux";
import { Link } from "react-router"; // Fixed import for react-router-dom


export default function Cart({ onClose }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [updating, setUpdating] = useState(false); // Prevent multiple API calls

  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

  const cart = useSelector((state) => state?.cart)
  
  // Fetch Cart Data
  const fetchCartData = useCallback(async () => {
    if (!id) { 
      setCartData(cart) 
      return
    }
    try {
      const { receiveObj } = await get(`/cart/${id}`);

      console.log("Cart API Response Data:", receiveObj);

      setCartData(receiveObj?.cart || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCartData();
  }, []);


  console.log('cartData', cartData)
  // Update quantity and refresh cart
  const updateQuantity = useCallback(
    async (productId, weight, change) => {
      if (updating) return; // Prevent multiple requests at the same time
      setUpdating(true);

      console.log("productId :>> ", productId);
      // Get current quantity from cartData instead of local state
      const currentItem = cartData?.items?.find(
        (item) => item.productId === productId && item.variant.weight === weight
      );

      if (!currentItem) {
        console.error("Item not found in cart");
        setUpdating(false);
        return;
      }

      const newQuantity = Math.max(currentItem.quantity + change, 1);

      try {
        await put("/cart/update", {
          userId: id,
          productId,
          weight,
          quantity: newQuantity, // Send updated quantity to API
        });

        // Refresh cart after update
        await fetchCartData();
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      } finally {
        setUpdating(false);
      }
    },
    [id, updating, fetchCartData, cartData]
  );

  const removeItem = useCallback(
    async (productId, weight) => {
      if (updating) return;
      setUpdating(true);

      try {
        await del("/cart/remove", {
          userId: id,
          productId,
          weight,
        });

        await fetchCartData();
      } catch (error) {
        console.error("Error removing item from cart:", error);
      } finally {
        setUpdating(false);
      }
    },
    [id, updating, fetchCartData]
  );

  const clearCart = useCallback(async () => {
    if (!id) return;
    setUpdating(true);
    try {
      await del(`/cart/clear/${id}`);
      setCartData({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setUpdating(false);
    }
  }, [id]);

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
          cartData?.items?.map((item) => {
            console.log("item :>> ", item);
            return (
              <div
                key={item._id}
                className="relative flex gap-7 items-center mt-8 ml-6 font-semibold"
              >
                <button
                  onClick={() =>
                    removeItem(item.productId, item.variant.weight)
                  }
                  className="absolute -top-4 right-4 text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>

                <div className="flex flex-col items-center w-14 py-2 bg-neutral-200 text-black rounded-3xl">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.variant.weight, 1)
                    }
                    className="w-full py-1 text-lg font-bold hover:bg-gray-300 rounded-t-3xl"
                    disabled={updating}
                  >
                    +
                  </button>
                  <span className="py-2 text-lg font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.variant.weight, -1)
                    }
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

      {cartData?.items?.length > 0 ? (
        <Link
          to="/checkout"
          className="py-3 bg-black text-white rounded-xl px-5 flex justify-between items-center mt-auto"
        >
          <span className="text-sm font-semibold">Checkout</span>
          <span className="px-5 py-2.5 text-base font-bold bg-yellow-400 text-black rounded-xl">
            ${cartData?.totalPrice ? cartData.totalPrice.toFixed(2) : "0.00"}
          </span>
        </Link>
      ) : (
        <p className="text-center text-red-500 mt-4">
          Please add products to your cart to proceed to checkout.
        </p>
      )}
    </div>
  );
}
