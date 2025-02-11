import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { post } from "../../services/http/axiosApi";
import { useNavigate } from "react-router";

const AddressForm = ({ title, button }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const id = user?.id;

  console.log("initail", initialData);

  const onSubmit = async (data) => {
    const payload = { ...data, userId: id }; // Include userId in the payload

    try {
      // Make the API call to create or update the address
      const { receiveObj } = await post(`/address/add/${id}`, payload);

      reset(); // Reset the form after submission

      // Check the response status
      if (receiveObj.status === true) {
        NotificationService.sendInfoMessage(receiveObj.message);
        onClose(); // Close the dialog after successful submission
        navigate("/profile"); // Redirect to the profile page
      } else {
        NotificationService.sendErrorMessage(
          "Error creating or updating address"
        );
      }
    } catch (error) {
      console.error("Error adding address:", error);
      NotificationService.sendErrorMessage(
        "An error occurred while adding the address."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h2 className="text-center font-semibold text-xl">{`${title} Address`}</h2>

      {/* Name Input */}
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

      {/* Street Input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          {...register("street", { required: "Street address is required" })}
          placeholder="Enter Street"
          className={`w-full p-2 border ${
            errors.street ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
        />
        {errors.street && (
          <p className="text-red-500 text-sm mt-2">*{errors.street.message}</p>
        )}
      </div>

      {/* City and State Inputs */}
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

      {/* Country and Pincode Inputs */}
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

      {/* "Add Address" Button */}
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
