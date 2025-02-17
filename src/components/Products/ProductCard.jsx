import React, { useState } from "react";
import { post } from "../../services/http/axiosApi";
import { useSelector } from "react-redux";
import { NotificationService } from "../../services/Notifcation";

function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]); // Default to first variant
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const handleVariantChange = (event) => {
    const selectedId = event.target.value;
    const variant = product.variants.find((v) => v._id === selectedId);
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      NotificationService.sendErrorMessage("Please Login First");
      return;
    }
    if (!selectedVariant) {
      NotificationService.sendErrorMessage(
        "Please select a variant before adding to cart."
      );
      return;
    }

    try {
      if (userId) {
        const response = await post("/cart/add", {
          userId,
          productId: product._id,
          weight: selectedVariant.weight,
          quantity: 1,
          price: selectedVariant.price,

          variantId:selectedVariant._id

        });
        if (response.receiveObj) {
          NotificationService.sendSuccessMessage(response.receiveObj.message);
        } else {
          NotificationService.sendErrorMessage(response.receiveObj.message);
        }

        // if (response.status === 200 || response.data?.success) {
        //   alert("Product added to cart successfully!");
        // } else {
        //   alert("Failed to add product to cart.");
        // }
      }

     console.log('selectedVariant',selectedVariant )

    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart.");
    }
  };

  return (
    <div className="flex flex-col p-5 w-full bg-white text-black rounded-xl shadow-md">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
      {/* {/ <p className="mt-2 text-sm text-gray-600">{product.description}</p> /} */}

      <div className="mt-4">
        <label className="block text-sm font-semibold">Choose Weight:</label>
        <select
          className="w-full p-2 mt-1 border rounded-md"
          onChange={handleVariantChange}
          value={selectedVariant._id}
        >
          {product.variants.map((variant) => (
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
