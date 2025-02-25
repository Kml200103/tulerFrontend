import React, { useEffect, useState } from "react";
import { del, get, post } from "../../services/http/axiosApi";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useForm, useFieldArray } from "react-hook-form";
import Pagination from "../../components/Pagination";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [showImageInput, setShowImageInput] = useState(false);
  const [previewOtherImages, setPreviewOtherImages] = useState([]); // State for previewing other images
  const [showOtherImageInput, setShowOtherImageInput] = useState(false); // State to control visibility of the other images input

  const [pageSize, setPageSize] = useState(10);
  const handleUpdateImageClick = () => {
    setShowImageInput(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  const [totalProducts, setTotalProducts] = useState(0); // To store total products

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      images: null,
      otherImages: [], // Initialize with an empty array for other images
      variants: [{ weight: "", price: null, quantity: null }],
      benefits: [""],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "benefits",
  });

  const getProducts = async () => {
    const { receiveObj } = await get(
      `/products?page=${currentPage}&pageSize=${pageSize}`
    );
    if (receiveObj.success) {
      setProducts(receiveObj.products);
      setTotalProducts(receiveObj.totalProducts); // Set total products from response
    } else {
      console.error("Failed to fetch products");
    }
  };

  // const handleImagePreview = (e) => {
  //   const files = e.target.files;
  //   if (files) {
  //     const imageUrls = Array.from(files).map((file) =>
  //       URL.createObjectURL(file)
  //     );
  //     setPreviewImages(imageUrls);

  //     // Set the first image as the default preview
  //     if (imageUrls.length > 0) {
  //       setSelectedImage(imageUrls[0]); // Assuming you have a state for the selected image
  //     }
  //   }
  // };

  const handleImagePreview = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages([e.target.result]); // Show the selected image preview

        // Update form value using setValue from RHF
        setValue("images", file, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOtherImagePreview = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files.length > 5) {
        setError("otherImages", {
          type: "manual",
          message: "You can upload a maximum of 5 images.",
        });
        return;
      } else {
        clearErrors("otherImages");
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      for (let i = 0; i < files.length; i++) {
        if (!validTypes.includes(files[i].type)) {
          setError("otherImages", {
            type: "manual",
            message: "Only JPEG, PNG, and GIF images are allowed.",
          });
          return;
        }
      }

      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewOtherImages(imageUrls);
    }
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    reset({
      name: product.name,
      description: product.description,
      images: product.images || null, // Set the main image URL
      variants: product.variants.map((variant) => ({
        weight: variant.weight,
        price: variant.price,
        quantity: variant.quantity,
      })),
      benefits: product.benefits || [""], // Set benefits
    });
    setPreviewImages([]); // Reset preview images when opening the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setPreviewImages([]); // Clear preview images when closing the modal
  };

  const handleUpdateProduct = async (data) => {
    // Check if the cover image input is visible and no new image is selected
    if (showImageInput && (!data.images || data.images.length === 0)) {
      setError("images", {
        type: "manual",
        message: "Please select a cover image to upload.",
      });
      return; // Prevent form submission
    }

    // Check for other images
    if (showOtherImageInput && previewOtherImages.length === 0) {
      setError("otherImages", {
        type: "manual",
        message: "Please select at least one other image to upload.",
      });
      return; // Prevent form submission
    }

    // Proceed with the update logic...
    const formData = new FormData();

    // Append the updated product data to the FormData object
    formData.append("name", data.name);
    formData.append("categoryId", selectedProduct.categoryId);
    formData.append("description", data.description);
    formData.append("productId", selectedProduct._id);

    // Append new cover image if uploaded
    if (data.images && data.images.length > 0) {
      formData.append("images", data.images[0]); // Main image
    }

    // Append new other images if uploaded
    if (data.otherImages && data.otherImages.length > 0) {
      Array.from(data.otherImages).forEach((file) => {
        formData.append("otherImages", file);
      });
    }

    // Append variants
    data.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][weight]`, variant.weight);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][quantity]`, variant.quantity);
    });

    // Append benefits
    data.benefits.forEach((benefit, index) => {
      formData.append(`benefits[${index}]`, benefit); // Append each benefit
    });

    try {
      // Call your update API
      const result = await post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.isSuccess) {
        console.log("Product updated successfully:", result.receiveObj);
        await getProducts(); // Refresh the product list
        handleCloseModal(); // Close the modal
      } else {
        console.error("Failed to update product:", result.receiveObj);
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
  const trimDescription = (description, maxLength = 100) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <>
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            className="w-1/2 p-2 pl-3 py-4 text-md text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Search Products here...."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative overflow-x-auto pt-[72px] md:pt-[96px]">
          {currentProducts.length > 0 ? (
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
                {currentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 border-b">
                      <img
                        src={product.images} // Display the first image
                        height={50}
                        width={50}
                        alt="Product Image"
                        className="rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">{product.name}</td>
                    <td className="px-6 py-4 text-center border-b">
                      {trimDescription(product.description, 50)}{" "}
                      {/* Trimmed description */}
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

        {/* Pagination Component */}
        <Pagination
          totalItems={filteredProducts.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          setPageSize={setPageSize}
          currentPage={currentPage}
        />
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
                                  trimmedValue.length >= 150 ||
                                  "Description must be at least 150 characters long"
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
                            *{errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <label
                        htmlFor="images"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Cover Image
                      </label>
                      {selectedProduct?.images ? (
                        <img
                          src={selectedProduct.images}
                          alt="Main Image"
                          className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                        />
                      ) : (
                        <p>No image available.</p>
                      )}

                      <div className="flex gap-3 mb-2">
                        {!showImageInput ? (
                          <button
                            type="button"
                            onClick={() => setShowImageInput(true)} // Show file input
                            className="mt-2 inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                          >
                            Update Cover Image
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowImageInput(false)} // Hide file input
                            className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      {showImageInput && (
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/gif"
                          {...register("images", {
                            required: "Cover image is required", // Make it required if needed
                            validate: {
                              validateFiles: (files) => {
                                const validTypes = [
                                  "image/jpeg",
                                  "image/png",
                                  "image/gif",
                                ];
                                if (files.length > 1) {
                                  return "Only one cover image can be uploaded.";
                                }
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
                      )}

                      {errors.images && (
                        <p className="text-red-600 text-sm mt-2">
                          {errors.images.message}
                        </p>
                      )}

                      {previewImages.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          <img
                            src={previewImages[0]}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Other Images */}
                    <div>
                      <label className="block text-md font-medium leading-6 text-gray-900">
                        Other Images
                      </label>
                      <div className="mt-2 flex space-x-2">
                        {selectedProduct?.otherImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Other Image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>

                      {/* Toggle Buttons */}
                      <div className="flex gap-3 mb-2">
                        {!showOtherImageInput ? (
                          <button
                            type="button"
                            onClick={() => setShowOtherImageInput(true)}
                            className="mt-2 inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                          >
                            Update Images
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setShowOtherImageInput(false);
                              clearErrors("otherImages"); // Clear error when hiding input
                            }}
                            className="mt-2 text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* File Input */}
                      {showOtherImageInput && (
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg, image/png, image/gif"
                          {...register("otherImages", {
                            validate: {
                              maxFiles: (files) => {
                                if (files.length > 5) {
                                  return "You can upload a maximum of 5 images.";
                                }
                                return true; // Valid if 5 or fewer files
                              },
                              validTypes: (files) => {
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
                          onChange={handleOtherImagePreview}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                        />
                      )}

                      {/* Error Messages */}
                      {errors.otherImages && (
                        <p className="text-red-600 text-sm mt-2">
                          {errors.otherImages.message}
                        </p>
                      )}

                      {/* Preview Images */}
                      {previewOtherImages.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          {previewOtherImages.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt={`Preview Other Image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div>
                      <label
                        htmlFor="benefits"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Benefits
                      </label>
                      <div className="mt-2">
                        {benefitFields.map((field, index) => (
                          <div key={field.id} className="mb-4">
                            <div className="flex items-center">
                              <input
                                type="text"
                                defaultValue={
                                  selectedProduct?.benefits[index] || ""
                                }
                                {...register(`benefits.${index}`, {
                                  required: "Benefit is required",
                                })}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                              <button
                                type="button"
                                onClick={() => removeBenefit(index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                X
                              </button>
                            </div>
                            {errors.benefits?.[index] && (
                              <p className="text-red-600 text-sm mt-2">
                                *{errors.benefits[index].message}
                              </p>
                            )}
                          </div>
                        ))}

                        {/* + Add Benefit Button */}
                        <button
                          type="button"
                          onClick={() => appendBenefit("")}
                          className="mt-2 text-indigo-600 "
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>

                    {/* Variants */}
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Variants
                      </label>
                      <div className="mt-2">
                        {variantFields.map((field, index) => (
                          <div key={field.id} className="mb-4">
                            <div className="flex space-x-4">
                              {/* Weight Field */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
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
                                    *{errors.variants[index].weight.message}
                                  </p>
                                )}
                              </div>

                              {/* Price Field */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                  Price
                                </label>
                                <input
                                  type="number"
                                  {...register(`variants.${index}.price`, {
                                    required: "Price is required",
                                    min: {
                                      value: 0,
                                      message:
                                        "Price must be a positive number",
                                    },
                                  })}
                                  placeholder="Price"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {errors.variants?.[index]?.price && (
                                  <p className="text-red-600 text-sm mt-2">
                                    *{errors.variants[index].price.message}
                                  </p>
                                )}
                              </div>

                              {/* Quantity Field */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
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
                                    *{errors.variants[index].quantity.message}
                                  </p>
                                )}
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* "+ Add Variant" Button */}
                        <button
                          type="button"
                          onClick={() =>
                            appendVariant({
                              weight: "",
                              price: "",
                              quantity: "",
                            })
                          }
                          className="mt-2 text-indigo-600"
                        >
                          + Add Variant
                        </button>
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
    </>
  );
};

export default AllProducts;
