import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { get, post } from "../../services/http/axiosApi";
import { NotificationService } from "../../services/Notifcation";
import { useSelector } from "react-redux";

const ProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState();

  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const getProduct = async () => {
    try {
      const { receiveObj } = await get(`/product/${productId}`);
      setProduct(receiveObj.product);
      setSelectedImage(receiveObj.product.images);
    } catch (err) {
      setError("An error occurred while fetching the product.");
    }
  };

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]); // Runs only when product data changes

  useEffect(() => {
    getProduct();
  }, []);

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
          variantId: selectedVariant._id,
        });
        if (response.receiveObj) {
          NotificationService.sendSuccessMessage(response.receiveObj.message);
        } else {
          NotificationService.sendErrorMessage(response.receiveObj.message);
        }
      }

      console.log("selectedVariant", selectedVariant);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart.");
    }
  };
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
    <main className="flex overflow-hidden flex-col bg-white my-40">
      <section className="self-center  mx-3 w-full max-w-[1398px]">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {/* Product Images Section */}
            <div className="w-full max-md:w-full">
              <div className="flex flex-col items-center">
                {/* Main Image */}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="object-contain w-3/4 max-w-[400px] aspect-[1.01] max-md:w-[250px] max-md:mt-10"
                />

                <div className="mt-8 w-full">
                  {/* Thumbnails Section - Includes Main Image + Other Images */}
                  <div className="flex gap-5 justify-center max-md:flex-col">
                    {[product.images, ...product.otherImages].map(
                      (src, index) => (
                        <div key={index} className="w-[30%] max-md:w-full">
                          <img
                            src={src}
                            alt={`Product thumbnail ${index + 1}`}
                            className={`object-contain grow shrink-0 mt-1.5 max-w-full rounded-none aspect-[0.99] w-full max-md:mt-8 cursor-pointer ${
                              selectedImage === src
                                ? "border-2 border-blue-500"
                                : ""
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
            <div className="ml-5 w-full max-md:ml-0 max-md:w-full">
              <section className="flex flex-col items-start w-full font-semibold text-black max-md:mt-10">
                <span className="px-3.5 py-1 text-lg bg-yellow-400 rounded-md">
                  {product.isAvailable ? "In stock" : "Out of stock"}
                </span>
                <h1 className="mt-6 text-3xl max-md:text-2xl">
                  {product.name}
                </h1>
                <p className="mt-2 text-lg text-gray-700">
                  Category: {product.categoryId?.name}
                </p>
                <div className="flex flex-col self-stretch pr-5 pl-0.5 mt-4 font-medium">
                  <p className="self-start text-2xl">
                    $
                    {selectedVariant
                      ? selectedVariant.price
                      : "Select a variant"}
                  </p>
                  <article className="mt-6 text-lg leading-7">
                    <p>{product.description}</p>
                    <h2 className="mt-4 font-semibold">Health Benefits:</h2>
                    <ul className="list-disc pl-5 mt-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </article>
                </div>
                <hr className="shrink-0 self-stretch mt-11 h-px bg-neutral-200 max-md:mt-10" />

                {/* Variants */}
                <h2 className="mt-6 text-xl font-semibold">
                  Available Variants:
                </h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className={`border p-4 rounded-md cursor-pointer transition-all duration-200 w-[120px] text-center ${
                        selectedVariant && selectedVariant._id === variant._id
                          ? "border-blue-500 bg-blue-100 shadow-md"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <p className="text-lg font-medium">{variant.weight}</p>
                    </div>
                  ))}
                </div>

                {/* Add to Cart Button */}
                {/* Add to Cart Button */}
                <button
                  className="flex gap-3.5 px-6 py-2.5 mt-9 text-xl text-white bg-black rounded-3xl max-md:px-5"
                  onClick={handleAddToCart} // Call the function on click
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/727d53825e6a14147b47563dfc8f4eaac0507e0d3ee80c28df0f723f93786223"
                    alt="Cart icon"
                    className="object-contain shrink-0 aspect-[1.04] w-[26px]"
                  />
                  Add to cart
                </button>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDescription;
