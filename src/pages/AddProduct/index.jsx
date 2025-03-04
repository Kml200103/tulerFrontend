import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { del, get, post } from "../../services/http/axiosApi";
import CategoryModal from "../../components/Modals/categoryModal";
import { NotificationService } from "../../services/Notifcation";
import { useNavigate } from "react-router";

const ProductPage = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      images: null,
      benefits: [],
      variants: [{ weight: "", price: null, quantity: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const token = localStorage.getItem("userToken");
  console.log(token);

  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [benefitError, setBenefitError] = useState("");
  // const [previewImages, setPreviewImages] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [benefitText, setBenefitText] = useState("");
  // Handle single image preview
  const handleCoverImagePreview = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null);
    }
  };

  // const handleImagePreview = (event) => {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     const imageUrls = Array.from(files).map((file) =>
  //       URL.createObjectURL(file)
  //     );
  //     setPreviewImages(imageUrls);
  //   }
  // };

  const addBenefit = () => {
    if (benefits.length >= 5) {
      alert("You can add a maximum of 5 benefits.");
      return;
    }

    if (benefitText.trim().split(/\s+/).length > 70) {
      alert("Each benefit must be within 70 words.");
      return;
    }

    setBenefits([...benefits, benefitText.trim()]);
    setBenefitText("");
  };

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  // const handleImagePreview = (e) => {
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     setValue("images", files); // Explicitly update form value
  //     const imageUrls = Array.from(files).map((file) =>
  //       URL.createObjectURL(file)
  //     );
  //     setPreviewImages(imageUrls);
  //   }
  // };

  const handleImagePreview = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convert FileList to array
      setValue("images", fileArray); // Update form field value
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(imageUrls);
    }
  };

  // const handleCoverImagePreview = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setValue("coverImage", file); // Ensure form gets updated
  //     setCoverImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const addCategory = async (name) => {
    const result = await post(
      "/category/createUpdate",
      { name },
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );

    // console.log("Add Category Response:", result); // Debugging

    if (result.isSuccess && result.receiveObj) {
      setIsCategoryDialogOpen(false);
    } else {
      console.error("Failed to add category:", result.receiveObj);
    }
  };

  // Update category via API
  const updateCategory = async (id, newName) => {
    const result = await post(
      `/category/createUpdate`,
      {
        name: newName,
        _id: id,
      },
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    if (result.isSuccess) {
      setIsCategoryDialogOpen(false);
    } else {
      console.error("Failed to update category:", result.receiveObj);
    }
  };

  // Delete category via API
  const deleteCategory = async (id) => {
    const result = await del(
      `/category/${id}`,
      {},
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    if (result.isSuccess) {
      setIsCategoryDialogOpen(false);
    } else {
      console.error("Failed to delete category:", result.receiveObj);
    }
  };

  const getCategory = async () => {
    const result = await get(
      "/category/all",
      {},
      { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    );
    // console.log(result);

    if (result.isSuccess) {
      // console.log("categoroes", categories);

      setCategories(result.receiveObj.categories);
    } else {
      console.error("Failed to get categories:", result.receiveObj);
    }
  };

  const onSubmit = async (data) => {
    // console.log("Form Data:", data); // Log the entire form data
    // console.log("Selected Category ID:", data.categoryId); // Log the category ID
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId); // This should now be the category ID
    formData.append("description", data.description);

    // Only append productId if it exists
    if (data.productId) {
      formData.append("productId", data.productId);
    }

    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file); // Ensuring array format for backend compatibility
      });
    }

    if (data.coverImage && data.coverImage.length > 0) {
      formData.append("coverImage", data.coverImage[0]);
    } else {
      console.warn("No cover image selected or file is empty");
    }

    // Append each variant separately
    data.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][weight]`, variant.weight);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][quantity]`, variant.quantity);
    });

    benefits.forEach((benefit, index) => {
      formData.append(`benefits[${index}]`, benefit);
    });
    // console.log("formData", formData);
    try {
      const result = await post("/product", formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      if (result.isSuccess) {
        // console.log("Product saved successfully:", result.receiveObj);
        NotificationService.sendSuccessMessage("Product saved successfully!");

        reset();
        navigate("/all-products");

        setBenefits([]);
      } else {
        console.error("Failed to save product:", result.receiveObj);
        NotificationService.sendErrorMessage(
          `Failed to save product: ${result.receiveObj.message}`
        );
      }
    } catch (error) {
      console.error("Error during product submission:", error);
      NotificationService.sendErrorMessage(
        "An error occurred while saving the product."
      );
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-3 sm:px-6 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        Add Product
      </h1>
      <div className="w-full max-w-3xl mx-auto">
        <div className="border border-gray-300 rounded-lg p-4 sm:p-6 shadow-md bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm sm:text-md font-medium leading-6 text-gray-900"
              >
                Product Name <span className="text-red-600">*</span>
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Product Name is required",
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
                    *{errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <label
                  htmlFor="category"
                  className="block text-sm sm:text-md font-medium leading-6 text-gray-900"
                >
                  Category <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDialogOpen(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm self-start sm:self-auto"
                >
                  Manage Categories
                </button>
              </div>
              <div className="mt-1 sm:mt-2">
                <select
                  id="category"
                  {...register("categoryId", {
                    required: "Category is required",
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
                    *{errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm sm:text-md font-medium leading-6 text-gray-900"
              >
                Description <span className="text-red-600">*</span>
              </label>
              <div className="mt-1 sm:mt-2">
                <textarea
                  id="description"
                  maxLength={250} // You can keep this if you want to limit the character count
                  {...register("description", {
                    required: "Description is required",
                    validate: {
                      maxWords: (value) => {
                        const wordCount = value.trim().split(/\s+/).length; // Split by whitespace
                        return (
                          wordCount <= 250 ||
                          "Description must not exceed 250 words"
                        );
                      },
                    },
                  })}
                  rows={4}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6"
                />
                {errors.description && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
                    *{errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-md font-medium text-gray-900">
                Benefits <span className="text-red-600">*</span> (Max 5)
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  type="text"
                  value={benefitText}
                  onChange={(e) => setBenefitText(e.target.value)}
                  placeholder="Enter a benefit point (Max 70 words)"
                  className="block w-full border p-2 rounded-md text-sm sm:text-base"
                />
                {benefitError && (
                  <p className="text-red-600 text-xs sm:text-sm mt-2">
                    *{benefitError}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!benefitText.trim()) {
                    setBenefitError("Benefit text cannot be empty");
                    return;
                  }
                  setBenefitError("");
                  addBenefit();
                }}
                disabled={benefits.length >= 5}
                className="mt-2 bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 text-sm sm:text-base"
              >
                Add Benefit
              </button>

              <ul className="mt-3 sm:mt-4 space-y-2">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm sm:text-base"
                  >
                    <span className="mr-2 break-words flex-1">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm sm:text-md font-medium leading-6 text-gray-900"
              >
                Cover Image <span className="text-red-600">*</span>
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  {...register("coverImage", {
                    required: "Cover image is required",
                    validate: (file) => {
                      if (!file || file.length === 0)
                        return "Cover image is required";
                      const validTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                      ];
                      if (!validTypes.includes(file[0]?.type)) {
                        return "Only JPEG, PNG, and GIF are allowed";
                      }
                      return true;
                    },
                  })}
                  onChange={handleCoverImagePreview}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6"
                />
                {errors.coverImage && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
                    *{errors.coverImage.message}
                  </p>
                )}
                {coverImagePreview && (
                  <div className="mt-2">
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 sm:mt-4">
              <label
                htmlFor="images"
                className="block text-sm sm:text-md font-medium leading-6 text-gray-900"
              >
                Other Images <span className="text-red-600">*</span>
              </label>
              <div className="mt-1 sm:mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/gif"
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
                            return "Only JPEG, PNG, and GIF are allowed";
                          }
                        }
                        return true;
                      },
                    },
                  })}
                  onChange={handleImagePreview}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:text-base sm:leading-6"
                />
                {errors.images && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
                    *{errors.images.message}
                  </p>
                )}
                {previewImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Preview"
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-md font-medium leading-6 text-gray-900 mb-2">
                Product Variants
              </h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-start sm:items-center mb-4"
                >
                  <div className="w-full sm:w-1/3">
                    <input
                      {...register(`variants.${index}.weight`, {
                        required: "Weight is required",
                      })}
                      placeholder="Enter Weight"
                      className="border p-2 rounded w-full text-sm sm:text-base"
                    />
                    {errors.variants?.[index]?.weight && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        *{errors.variants[index].weight.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/3">
                    <input
                      {...register(`variants.${index}.price`, {
                        required: "Price is required",
                        min: {
                          value: 0,
                          message: "Price must be a positive number",
                        },
                      })}
                      type="number"
                      placeholder="Enter Price"
                      className="border p-2 rounded w-full text-sm sm:text-base"
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        *{errors.variants[index].price.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/3 flex items-center">
                    <input
                      {...register(`variants.${index}.quantity`, {
                        required: "Quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1",
                        },
                      })}
                      type="number"
                      placeholder="Enter Stock"
                      className="border p-2 rounded w-full text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 ml-2 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  {errors.variants?.[index]?.quantity && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1">
                      *{errors.variants[index].quantity.message}
                    </p>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ weight: "", price: 0, quantity: 0 })}
                className="mt-2 text-yellow-500 flex items-center gap-1 text-sm sm:text-base"
              >
                <span className="text-lg">+</span> Add Variant
              </button>
            </div>

            <div className="flex justify-center pt-2 sm:pt-4">
              <button
                type="submit"
                className="w-full sm:w-1/2 md:w-1/3 rounded-md bg-indigo-600 py-1.5 text-sm sm:text-md font-semibold text-white shadow-sm ring-1 ring-gray-900/10 hover:bg-indigo-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        categories={categories}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        updateCategory={updateCategory}
        getCategory={getCategory}
      />
    </div>
  );
};

export default ProductPage;
