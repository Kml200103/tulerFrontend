import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { get, post } from "../../services/http/axiosApi";
import { NotificationService } from "../../services/Notifcation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";

const ProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const dispatch = useDispatch();
  const getProduct = useCallback(async () => {
    try {
      const { receiveObj } = await get(`/product/${productId}`);
      setProduct(receiveObj.product);
      setSelectedImage(receiveObj.product.images);
      if (receiveObj.product?.variants?.length > 0) {
        setSelectedVariant(receiveObj.product.variants[0]);
      }
    } catch (err) {
      setError("Failed to fetch product.");
      NotificationService.sendErrorMessage("Failed to fetch product.");
    }
  }, [productId]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleAddToCart = useCallback(async () => {
    if (!userId) {
      const payload = {
        variant: {
          weight: selectedVariant.weight,
          price: selectedVariant.price, // Ensure price is included
        },
        productId: product._id,
        variantId: selectedVariant._id, // Include variantId
        weight: selectedVariant.weight,
        price: selectedVariant.price, // Ensure price is explicitly included
        totalPrice: selectedVariant.price, // Explicitly set totalPrice
        images: product.images,
        quantity: 1, // Default quantity is 1
        productName: product.name,
      };

      NotificationService.sendSuccessMessage("Item Added to Cart");
      dispatch(addToCart(payload)); // Dispatch the action
      return;
    }
    if (!selectedVariant) {
      NotificationService.sendErrorMessage(
        "Please select a variant before adding to cart."
      );
      return;
    }

    try {
      const response = await post(
        "/cart/add",
        {
          userId,
          productId: product._id, // Ensure this is defined
          variantId: selectedVariant._id,
          weight: selectedVariant.weight,
          quantity: 1,
          price: selectedVariant.price,
        },
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );

      // console.log("Cart API Response:", response);

      if (response.receiveObj) {
        NotificationService.sendSuccessMessage(response.receiveObj.message);
      } else {
        NotificationService.sendErrorMessage(response.receiveObj.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart.");
    }
  }, [userId, product, selectedVariant, dispatch]);

  const thumbnails = useMemo(() => {
    if (!product) return [];
    return [product.images, ...product.otherImages];
  }, [product]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-red-500 text-2xl">{error}</h1>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <main className="flex overflow-hidden flex-col bg-white my-6 md:my-10 lg:my-20">
      <section className="self-center w-full max-w-[1398px] px-4 md:px-6">
        <div className="max-w-full">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Product Images Section */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col items-center">
                {/* Main Image */}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="object-contain w-full max-w-[350px] md:max-w-[400px] aspect-square"
                />

                {/* Thumbnails Section */}
                <div className="mt-4 md:mt-8 w-full">
                  <div className="flex gap-2 md:gap-4 justify-center overflow-x-auto pb-2">
                    {[product.images, ...product.otherImages].map(
                      (src, index) => (
                        <div
                          key={index}
                          className="w-[80px] md:w-[100px] flex-shrink-0"
                        >
                          <img
                            src={src}
                            alt={`Product thumbnail ${index + 1}`}
                            className={`object-contain w-full aspect-square cursor-pointer ${
                              selectedImage === src
                                ? "border-2 border-blue-500"
                                : "border border-gray-200"
                            }`}
                            onClick={() => setSelectedImage(src)}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <div className="w-full">
                <section className="flex flex-col items-start w-full font-semibold text-black">
                  <span className="px-3 py-1 text-sm bg-yellow-400 rounded-md">
                    {product.isAvailable ? "In stock" : "Out of stock"}
                  </span>

                  <h1 className="mt-4 text-xl md:text-2xl lg:text-3xl">
                    {product.name}
                  </h1>

                  <p className="mt-2 text-sm text-gray-700">
                    Category: {product.categoryId?.name}
                  </p>

                  <div className="w-full mt-4 font-medium">
                    <p className="text-xl md:text-2xl">
                      $
                      {selectedVariant
                        ? selectedVariant.price
                        : "Select a variant"}
                    </p>

                    <article className="mt-4 text-sm md:text-base leading-6">
                      <p>{product.description}</p>
                      <h2 className="mt-4 font-semibold">Health Benefits:</h2>
                      <ul className="list-disc pl-5 mt-2">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="mb-1">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>

                  <hr className="w-full my-6" />

                  {/* Variants */}
                  <h2 className="text-lg font-semibold">Available Variants:</h2>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className={`border p-3 rounded-md cursor-pointer transition-all duration-200 w-[90px] text-center ${
                          selectedVariant && selectedVariant._id === variant._id
                            ? "border-blue-500 bg-blue-100 shadow-md"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <p className="text-sm font-medium">{variant.weight}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="flex items-center justify-center gap-2 px-5 py-2.5 mt-6 text-base md:text-lg text-white bg-black rounded-full w-full md:w-auto"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant}
                  >
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/727d53825e6a14147b47563dfc8f4eaac0507e0d3ee80c28df0f723f93786223"
                      alt="Cart icon"
                      className="w-5 h-5 object-contain"
                    />
                    Add to cart
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default ProductDescription;
