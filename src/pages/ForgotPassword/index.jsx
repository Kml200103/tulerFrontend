import React from "react";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePassword = (data) => {
    // Handle password reset logic here
    console.log(data);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(handlePassword)}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address <span className="text-red-600">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email Address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                autoComplete="email"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  p-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm sm:leading-6 ${
                  errors.email ? "border-red-500 ring-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-3">
                  *{errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="flex w-full justify-center text-white rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              Click here to get mail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
