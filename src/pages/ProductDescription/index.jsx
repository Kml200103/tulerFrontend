import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { get } from "../../services/http/axiosApi";

const mainImage =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/35424819294203ece7f0c7cc8b3326e6ad117eeb20dea7f5f1583d3b269e4812";
const thumbnails = [
  "https://cdn.builder.io/api/v1/image/assets/TEMP/63c0c707c1ce28669090baaee1de5bc1bcb1782f71036df36282a8eb8d125ef6",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/eae0803e85bd76a8a1160021d6c0b254c79dd306e97b3a3f788836bb911b0e39",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/1b45c75a977220bd52248393ec6a732961df41f19b0a0ced4929d0aa37df8ea8",
];

const ProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const getProduct = async () => {
    try {
      const { receiveObj } = await get(`/product/${productId}`);
      setProduct(receiveObj.product);
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
    console.log(selectedVariant);
  }, [selectedVariant]); // Logs the selected variant after it is updated

  useEffect(() => {
    getProduct();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-red-500 text-2xl">{error}</h1>
      </div>
    );
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex overflow-hidden flex-col bg-white">
      <section className="self-center mt-10 mx-3 w-full max-w-[1398px]">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-full max-md:w-full">
              <div className="flex flex-col items-center">
                {" "}
                {/* Center align the image */}
                <img
                  src={mainImage}
                  alt={product.name}
                  className="object-contain w-3/4 max-w-[400px] aspect-[1.01] max-md:w-[250px] max-md:mt-10"
                />
                <div className="mt-8 w-full">
                  <div className="flex gap-5 justify-center max-md:flex-col">
                    {thumbnails.map((src, index) => (
                      <div key={index} className="w-[30%] max-md:w-full">
                        <img
                          src={src}
                          alt={`Product thumbnail ${index + 1}`}
                          className="object-contain grow shrink-0 mt-1.5 max-w-full rounded-none aspect-[0.99] w-full max-md:mt-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-5 w-full max-md:ml-0 max-md:w-full">
              <section className="flex flex-col items-start w-full font-semibold text-black max-md:mt-10">
                <span className="px-3.5 py-1 text-lg bg-yellow-400 rounded-md">
                  {product.isAvailable ? "In stock" : "Out of stock"}
                </span>
                <h1 className="mt-6 text-3xl max-md:text-2xl">
                  {product.name}
                </h1>
                <div className="flex flex-col self-stretch pr-5 pl-0.5 mt-4 font-medium">
                  <p className="self-start text-2xl">
                    ${selectedVariant ? selectedVariant.price : 0}
                  </p>
                  <article className="mt-6 text-lg leading-7">
                    <p>{product.description}</p>
                    <h2 className="mt-4 font-semibold">Health Benefits :</h2>
                    <ul className="list-disc pl-5 mt-2">
                      <li>
                        Boosts immunity with its antibacterial and antioxidant
                        properties.
                      </li>
                      <li>
                        Supports digestion by promoting gut health and acting as
                        a prebiotic.
                      </li>
                      <li>
                        Regulates blood sugar levels better than other honeys
                        due to its lower glucose content.
                      </li>
                      <li>
                        Soothes sore throats and acts as a natural cough
                        suppressant.
                      </li>
                    </ul>
                  </article>
                </div>
                <hr className="shrink-0 self-stretch mt-11 h-px bg-neutral-200 max-md:mt-10" />
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

                <button
                  className="flex gap-3.5 px-6 py-2.5 mt-9 text-xl text-white bg-black rounded-3xl max-md:px-5"
                  onClick={() => console.log("Add to cart clicked")}
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
