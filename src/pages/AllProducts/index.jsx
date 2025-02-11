import React, { useEffect, useState } from "react";
import { del, get, post } from "../../services/http/axiosApi";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useForm, useFieldArray } from "react-hook-form";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      images: null,
      variants: [{ weight: "", price: null, quantity: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const getProducts = async () => {
    const { receiveObj } = await get("/products");
    if (receiveObj.success) {
      setProducts(receiveObj.products);
    } else {
      console.error("Failed to fetch products");
    }
  };

  const handleImagePreview = (e) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(imageUrls);
      console.log("Preview Images:", imageUrls); // Debugging line
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  console.log("selected", selectedProduct);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    reset({
      name: product.name,
      description: product.description,
      images: null,
      variants: product.variants.map((variant) => ({
        weight: variant.weight,
        price: variant.price,
        quantity: variant.quantity,
      })),
    });
    setPreviewImages([]); // Reset preview images when opening the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setPreviewImages([]); // Clear preview images when closing the modal
  };

  const handleUpdateProduct = async (data) => {
    const formData = new FormData();

    // Append the updated product data to the FormData object
    formData.append("name", data.name);
    formData.append("categoryId", selectedProduct.categoryId); // Use the categoryId from the selected product
    formData.append("description", data.description);
    formData.append("productId", selectedProduct._id); // Use the ID of the selected product

    // Append new images if any
    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    // Append each variant separately
    data.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][weight]`, variant.weight);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][quantity]`, variant.quantity);
    });

    // Call your update API here
    const result = await post("/product", formData, {
      "Content-Type": "multipart/form-data",
    });

    if (result.isSuccess) {
      console.log("Product updated successfully:", result.receiveObj);
      await getProducts(); // Fetch updated products
      handleCloseModal(); // Close the modal
    } else {
      console.error("Failed to update product:", result.receiveObj);
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      const { receiveObj } = await del(`/product/${product._id}`); // Use the correct product ID
      if (receiveObj.success) {
        console.log("Product deleted successfully:", receiveObj);
        window.location.reload(); // Refresh the entire page
      } else {
        console.error("Failed to delete product:", receiveObj);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="w-1/2 p-2 pl-3 py-4 text-md text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Search Products here...."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="w-4 h-4 absolute left-3 top-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="relative overflow-x-auto">
        {filteredProducts.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th scope="col" className="px-6 py-3 border-b">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 border-b w-1/4">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 border-b">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 border-b">
                  Variants
                </th>
                <th scope="col" className="px-6 py-3 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 border-b">
                    <img
                      src={product.images[0]} // Display the first image
                      height={50}
                      width={50}
                      alt="Product Image"
                      className="rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 border-b">{product.name}</td>
                  <td className="px-6 py-4 text-center border-b">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-center border-b">
                    {product.variants.map((variant) => (
                      <div key={variant._id}>
                        {variant.weight} - ${variant.price} (Qty:{" "}
                        {variant.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <button
                      type="button"
                      className="text-white p-2 rounded-lg flex items-center justify-center"
                      onClick={() => handleOpenModal(product)}
                    >
                      <PencilIcon className="h-6 w-6 text-gray-500" />
                    </button>
                    <button
                      className="bg-white font-bold rounded-full p-2 flex items-center justify-center mr-2"
                      onClick={() => handleDeleteProduct(product)} // Call the delete function
                    >
                      <TrashIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <h1 className="text-xl">No products found</h1>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          className="relative z-50"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="flex items-center justify-center fixed inset-0 z-50">
            <DialogPanel className="relative transform overflow-scroll rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-3xl w-full max-h-[85vh]">
              <div className="bg-gray-50 px-6 py-8 sm:px-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Update Product
                </h1>
                <div
                  onClick={handleCloseModal}
                  className="absolute top-0 right-0 p-4 text-gray-400 hover:text-gray-600 transition duration-300 ease-in-out"
                ></div>
                <div className="flex flex-col items-center justify-center mx-auto w-full">
                  <form
                    className="space-y-6 w-full mx-auto"
                    noValidate
                    onSubmit={handleSubmit(handleUpdateProduct)}
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="name"
                          type="text"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          defaultValue={selectedProduct?.name}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-2">
                            *{errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Description <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          {...register("description", {
                            required: "Description is required",
                            validate: {
                              minLength: (value) => {
                                const trimmedValue = value.replace(/\s/g, ""); // Remove spaces
                                return (
                                  trimmedValue.length >= 10 ||
                                  "Description must be at least 10 characters long"
                                );
                              },
                            },
                          })}
                          defaultValue={selectedProduct?.description}
                          rows={4}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                        />
                        {errors.description && (
                          <p className="text-red-600 text-sm mt-2">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    <input
                      type="file"
                      multiple
                      {...register("images", {
                        required: "At least one image is required",
                        validate: {
                          validateFiles: (files) => {
                            if (files.length === 0)
                              return "At least one image is required";
                            const validTypes = [
                              "image/jpeg",
                              "image/png",
                              "image/gif",
                            ];
                            for (let i = 0; i < files.length; i++) {
                              if (!validTypes.includes(files[i].type)) {
                                return "Only image files are allowed (JPEG, PNG, GIF)";
                              }
                            }
                            return true; // All files are valid
                          },
                        },
                      })}
                      onChange={handleImagePreview}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    />

                    {previewImages.length > 0 && (
                      <div className="mt-2 flex space-x-2">
                        {previewImages.map((src, index) => (
                          <img
                            key={index}
                            src={src} // Directly using the URL from the array
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* Variants */}
                    <div>
                      <label
                        htmlFor="variants"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Variants
                      </label>
                      <div className="mt-2">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex space-x-4 mb-4">
                            <div className="flex-1">
                              <label
                                htmlFor={`variants.${index}.weight`}
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Weight
                              </label>
                              <input
                                type="text"
                                {...register(`variants.${index}.weight`, {
                                  required: "Weight is required",
                                })}
                                placeholder="Weight"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {errors.variants?.[index]?.weight && (
                                <p className="text-red-600 text-sm mt-2">
                                  {errors.variants[index].weight.message}
                                </p>
                              )}
                            </div>

                            <div className="flex-1">
                              <label
                                htmlFor={`variants.${index}.price`}
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                {...register(`variants.${index}.price`, {
                                  required: "Price is required",
                                  min: {
                                    value: 0,
                                    message: "Price must be a positive number",
                                  },
                                })}
                                placeholder="Price"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {errors.variants?.[index]?.price && (
                                <p className="text-red-600 text-sm mt-2">
                                  {errors.variants[index].price.message}
                                </p>
                              )}
                            </div>

                            <div className="flex-1">
                              <label
                                htmlFor={`variants.${index}.quantity`}
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Quantity
                              </label>
                              <input
                                type="number"
                                {...register(`variants.${index}.quantity`, {
                                  required: "Quantity is required",
                                  min: {
                                    value: 1,
                                    message: "Quantity must be at least 1",
                                  },
                                })}
                                placeholder="Quantity"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              {errors.variants?.[index]?.quantity && (
                                <p className="text-red-600 text-sm mt-2">
                                  {errors.variants[index].quantity.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AllProducts;
