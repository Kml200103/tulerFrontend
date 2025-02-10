import React from "react";
import { useForm } from "react-hook-form";

const ProfileUpdateDialog = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission, e.g., send data to an API
    console.log("Profile updated:", data);

    // Close the dialog after submission
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-4/5 max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl p-2" // Increased size
          onClick={onClose} // Close dialog on click
        >
          &times; {/* This is the "X" character */}
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Name Input */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter your name"
              className={`w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">
                *{errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="Enter your email"
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                *{errors.email.message}
              </p>
            )}
          </div>
          {/* Mobile Number Input */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              {...register("mobile", { required: "Mobile number is required" })}
              placeholder="Enter your mobile number"
              className={`w-full p-2 border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-2">
                *{errors.mobile.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="text-blue-500 hover:text-blue-700 hover:underline"
            >
              {`Update Profile`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateDialog;
