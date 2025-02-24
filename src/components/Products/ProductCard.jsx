import React, { useState } from "react";
import { post } from "../../services/http/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { NotificationService } from "../../services/Notifcation";
import { useNavigate } from "react-router"; // Import useNavigate
import { addToCart } from "../../redux/cart/cartSlice";

function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const navigate = useNavigate(); // Call useNavigate to get the navigate function
  const dispatch = useDispatch()
  const handleVariantChange = (event) => {
    const selectedId = event.target.value;
    const variant = product.variants.find((v) => v._id === selectedId);
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      console.log('product', product)
      // NotificationService.sendErrorMessage("Please Login First");
      const payload = {
        variant: { weight: selectedVariant.weight },
        productId: product._id,
        variantId: selectedVariant._id,
        weight: selectedVariant.weight,
        totalPrice: selectedVariant.price,
        images: product.images,
        quantity: 1,
        productName: product.name
      }
      dispatch(addToCart(payload))
      return;
    }
    if (!selectedVariant) {
      NotificationService.sendErrorMessage(
        "Please select a variant before adding to cart."
      );
      return;
    }



    try {
      const response = await post("/cart/add", {
        userId,
        productId: product._id, // Ensure this is defined
        variantId: selectedVariant._id,
        weight: selectedVariant.weight,
        quantity: 1,
        price: selectedVariant.price,
      });

      console.log("Cart API Response:", response);

      if (response.receiveObj) {
        NotificationService.sendSuccessMessage(response.receiveObj.message);
      } else {
        NotificationService.sendErrorMessage(response.receiveObj.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart.");
    }
  };

  const handleCardClick = () => {
    // Get the product name and format it for the URL
    const productName = product.name.trim().replace(/\s+/g, "-"); // Replace spaces with hyphens
    const productId = product._id;
    console.log(productName);
    navigate(`/product/description/${productName}/${productId}`); // Navigate to the product description page
  };

  return (
    <div className="flex flex-col p-5 w-full bg-white text-black rounded-xl shadow-md cursor-pointer">
      <img
        src={product.images}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      <h2 className="mt-4 text-xl font-semibold" onClick={handleCardClick}>
        {product.name}
      </h2>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Choose Weight:</label>
        <select
          className="w-full p-2 mt-1 border rounded-md"
          onChange={handleVariantChange}
          value={selectedVariant._id}
        >
          {product?.variants.map((variant) => (
            <option key={variant._id} value={variant._id}>
              {variant.weight} - ₹{variant.price}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
