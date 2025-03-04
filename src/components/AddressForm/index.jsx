import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { post } from "../../services/http/axiosApi";
import { useNavigate } from "react-router";

const AddressForm = ({ title, button, onClose, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

  // console.log("initail", initialData);

  // Pre-fill the form when editing
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    // console.log('data', data);
    const payload = { ...data, userId: id };
    const endpoint = initialData
      ? `/address/add/${id}/${data._id}`
      : `/address/add/${id}`;

    try {
      const { receiveObj } = await post(endpoint, payload);

      if (receiveObj.success) {
        NotificationService.sendInfoMessage(receiveObj.message);
        onClose(true); // Close modal and refresh addresses
      } else {
        NotificationService.sendErrorMessage("Error processing the address.");
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      NotificationService.sendErrorMessage(
        "An error occurred while processing the address."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-center font-semibold text-xl">{`${title} Address`}</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter Name"
          className={`w-full p-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-2">*{errors.name.message}</p>
        )}
      </div>

      {/* Street */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          {...register("streetAddress", {
            required: "Street address is required",
          })}
          placeholder="Enter Street"
          className={`w-full p-2 border ${
            errors.streetAddress ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
        />
        {errors.streetAddress && (
          <p className="text-red-500 text-sm mt-2">
            *{errors.streetAddress.message}
          </p>
        )}
      </div>

      {/* City & State */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label className="block mb-1 font-medium text-gray-700">City</label>
          <input
            type="text"
            {...register("city", { required: "City is required" })}
            placeholder="Enter City"
            className={`w-full p-2 border ${
              errors.city ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-2">*{errors.city.message}</p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block mb-1 font-medium text-gray-700">State</label>
          <input
            type="text"
            {...register("state", { required: "State is required" })}
            placeholder="Enter State"
            className={`w-full p-2 border ${
              errors.state ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-2">*{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* Country & Pincode */}
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label className="block mb-1 font-medium text-gray-700">
            Country
          </label>
          <select
            {...register("country", { required: "Country is required" })}
            className={`w-full p-2 border ${
              errors.country ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-2">
              *{errors.country.message}
            </p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block mb-1 font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            {...register("pincode", { required: "Pincode is required" })}
            placeholder="Enter Pincode"
            className={`w-full p-2 border ${
              errors.pincode ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm mt-2">
              *{errors.pincode.message}
            </p>
          )}
        </div>
      </div>

      {/* Address Type */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Address Type
        </label>
        <div className="flex space-x-4">
          <div>
            <input
              type="radio"
              value="home"
              {...register("addressType", {
                required: "Address type is required",
              })}
              id="home"
              className="mr-2"
            />
            <label htmlFor="home" className="text-gray-700">
              Home
            </label>
          </div>
          <div>
            <input
              type="radio"
              value="office"
              {...register("addressType", {
                required: "Address type is required",
              })}
              id="office"
              className="mr-2"
            />
            <label htmlFor="office" className="text-gray-700">
              Office
            </label>
          </div>
        </div>
        {errors.addressType && (
          <p className="text-red-500 text-sm mt-2">
            *{errors.addressType.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          {`${button} Address`}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
