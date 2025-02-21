import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useRegisterUserMutation } from "../../services/http/userService";
import { NotificationService } from "../../services/Notifcation";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasNumber: /[0-9]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#\$%\^&\*]/.test(password),
    };

    const allPassed = Object.values(validations).every(Boolean);
    if (!validations.minLength) {
      setError("password", {
        type: "manual",
        message: "Password must be at least 8 characters",
      });
    } else if (!validations.hasNumber) {
      setError("password", {
        type: "manual",
        message: "Password must contain at least one number",
      });
    } else if (!validations.hasLowercase) {
      setError("password", {
        type: "manual",
        message: "Password must contain at least one lowercase letter",
      });
    } else if (!validations.hasUppercase) {
      setError("password", {
        type: "manual",
        message: "Password must contain at least one uppercase letter",
      });
    } else if (!validations.hasSpecialChar) {
      setError("password", {
        type: "manual",
        message: "Password must contain at least one special character",
      });
    }

    return allPassed;
  };

  const onSubmit = async (data) => {
    if (validatePassword(data.password)) {
      console.log(data);
      try {
        const res = await registerUser(data);
        if (res.data.success) {
          NotificationService.sendSuccessMessage(res.data.message);
          navigate("/login");
        } else {
          NotificationService.sendErrorMessage(
            res.data.error || "An error occurred during registration."
          );
        }
      } catch (error) {
        // Handle any unexpected errors
        NotificationService.sendErrorMessage(
          error.response?.data?.error || "An unexpected error occurred."
        );
      }
    } else {
      NotificationService.sendErrorMessage("Password validation failed.");
    }
  };

  return (
    // <div className="container mt-5 flex flex-col rounded-none max-w-[416px]">
    //   <img
    //     loading="lazy"
    //     src="https://cdn.builder.io/api/v1/image/assets/TEMP/6646851ad12990fecee190e5be75d604d70a729c850db264080b443c2f07a236?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
    //     alt="Register Illustration"
    //     className="object-contain self-center max-w-full aspect-[1.47] w-[100px]"
    //   />
    //   <div className="self-center mt-7 text-sm text-stone-500">
    //     By signing up, you agree to our{" "}
    //     <span className="text-yellow-400">terms</span> &{" "}
    //     <span className="text-yellow-400">policy</span>
    //   </div>

    //   <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
    //     {/* Name input */}
    //     <div className="mt-4">
    //       <label
    //         htmlFor="name"
    //         className="block text-sm font-medium text-gray-700"
    //       >
    //         Name
    //       </label>
    //       <input
    //         id="name"
    //         type="text"
    //         {...register("name", { required: "Name is required" })}
    //         className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${
    //           errors.name ? "border-red-400" : "border-gray-300"
    //         } border-solid text-neutral-700`}
    //       />
    //       {errors.name && (
    //         <p className="text-red-400 text-sm mt-3">*{errors.name.message}</p>
    //       )}
    //     </div>

    //     {/* Email input */}
    //     <div className="mt-4">
    //       <label
    //         htmlFor="email"
    //         className="block text-sm font-medium text-gray-700"
    //       >
    //         Email
    //       </label>
    //       <input
    //         id="email"
    //         type="email"
    //         {...register("email", {
    //           required: "Email is required",
    //           pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
    //         })}
    //         className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${
    //           errors.email ? "border-red-400" : "border-gray-300"
    //         } border-solid text-neutral-700`}
    //       />
    //       {errors.email && (
    //         <p className="text-red-400 text-sm mt-3">*{errors.email.message}</p>
    //       )}
    //     </div>
    //     <div className="mt-4">
    //       <label
    //         htmlFor="phoneNumber"
    //         className="block text-sm font-medium text-gray-700"
    //       >
    //         Phone Number
    //       </label>
    //       <input
    //         id="phone"
    //         type="text"
    //         maxLength={10}
    //         {...register("phone", {
    //           required: "Phone number is required",
    //           pattern: {
    //             value: /^[6-9]\d{9}$/, // Must start with 6-9 and followed by 9 digits
    //             message:
    //               "Invalid phone number format. Must be 10 digits and start with 6-9.",
    //           },
    //           maxLength: {
    //             value: 10,
    //             message: "Phone number must be exactly 10 digits.",
    //           },
    //         })}
    //         className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${
    //           errors.phone ? "border-red-400" : "border-gray-300"
    //         } border-solid text-neutral-700`}
    //       />
    //       {errors.phone && (
    //         <p className="text-red-400 text-sm mt-3">*{errors.phone.message}</p>
    //       )}
    //     </div>

    //     {/* Password input */}
    //     <div className="mt-4 relative">
    //       <div className="flex justify-between items-center">
    //         <label
    //           htmlFor="password"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Password
    //         </label>
    //         <a href="#" className="text-xs text-red-400">
    //           Forgot Password?
    //         </a>
    //       </div>
    //       <div className="relative">
    //         <input
    //           id="password"
    //           type={showPassword ? "text" : "password"}
    //           {...register("password", {
    //             required: "Password is required",
    //           })}
    //           autoComplete="current-password"
    //           className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${
    //             errors.password ? "border-red-400" : "border-gray-300"
    //           } border-solid text-neutral-700`}
    //         />
    //         <button
    //           type="button"
    //           onClick={() => setShowPassword(!showPassword)}
    //           className="absolute right-4 top-1/2 transform -translate-y-1/2"
    //         >
    //           {showPassword ? (
    //             <svg
    //               className="inline-block align-middle cursor-pointer"
    //               width="1.5rem"
    //               height="1.5rem"
    //               viewBox="0 0 1024 1024"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path d="M512 576c-35.285 0-64-28.715-64-64s28.715-64 64-64c35.285 0 64 28.715 64 64s-28.715 64-64 64zM512 362.667c-82.342 0-149.331 66.987-149.331 149.333s66.989 149.333 149.331 149.333c82.347 0 149.333-66.987 149.333-149.333s-66.987-149.333-149.333-149.333zM521.374 725.231c-183.721 4.267-303.571-152.875-343.337-213.419 43.776-68.48 154.027-208.683 324.606-213.035 182.997-4.651 303.535 152.875 343.296 213.419-43.729 68.48-154.022 208.683-324.565 213.035zM933.026 490.778c-27.226-47.445-177.583-285.269-432.559-277.291-235.859 5.973-373.033 213.76-409.47 277.291-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 235.814-6.016 373.035-213.76 409.472-277.291 7.509-13.141 7.509-29.312 0-42.453z"></path>
    //             </svg>
    //           ) : (
    //             <svg
    //               className="inline-block align-middle cursor-pointer"
    //               width="1.5rem"
    //               height="1.5rem"
    //               viewBox="0 0 1024 1024"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path d="M512 576c-35.285 0-64-28.715-64-64 0-0.559 0.132-1.105 0.26-1.651v0c0.115-0.499 0.235-0.998 0.252-1.506l66.645 66.645c-0.508 0.021-1.007 0.137-1.502 0.256-0.55 0.128-1.097 0.256-1.655 0.256zM200.834 140.501c-16.683-16.683-43.648-16.683-60.331 0s-16.683 43.648 0 60.331l240.213 240.213c-11.776 21.717-18.048 45.824-18.048 70.955 0 82.347 66.989 149.333 149.331 149.333 25.135 0 49.237-6.272 70.955-18.048l240.213 240.213c8.32 8.32 19.243 12.501 30.165 12.501 10.927 0 21.85-4.181 30.17-12.501 16.683-16.683 16.683-43.648 0-60.331l-682.669-682.667zM521.378 725.231c-183.682 4.267-303.575-152.875-343.341-213.419 19.499-30.464 52.181-75.093 97.408-115.669l-60.203-60.245c-64.939 59.264-106.581 124.032-124.245 154.88-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 50.517-1.28 96.256-12.203 137.685-28.587l-67.413-67.413c-22.827 6.059-46.848 10.069-72.448 10.709zM500.467 213.478c254.938-7.979 405.333 229.845 432.559 277.291 7.509 13.141 7.509 29.312 0 42.453-17.711 30.848-59.354 95.616-124.288 154.88l-60.207-60.245c45.231-40.576 77.956-85.205 97.408-115.669-39.761-60.544-160.213-218.027-343.292-213.419-25.604 0.64-49.621 4.651-72.495 10.709l-67.411-67.413c41.472-16.384 87.17-27.307 137.726-28.587z"></path>
    //             </svg>
    //           )}
    //         </button>
    //       </div>
    //       {/* Error message placeholder to prevent shifting */}
    //       <p className="text-red-400 text-sm min-h-[1rem] mt-1">
    //         {errors.password ? `*${errors.password.message}` : ""}
    //       </p>
    //     </div>

    //     <button className="px-16 py-4 mt-10 w-full text-xs font-semibold whitespace-nowrap bg-yellow-400 rounded-xl text-neutral-700">
    //       Register
    //     </button>
    //   </form>

    //   <div className="flex gap-4 items-center mt-8 text-sm text-black whitespace-nowrap">
    //     <div className="flex shrink-0 self-stretch my-auto h-px bg-gray-300 w-[182px]" />
    //     <div className="self-stretch">Or</div>
    //     <div className="flex shrink-0 self-stretch my-auto h-px bg-gray-300 w-[182px]" />
    //   </div>

    //   <div className="flex self-center mt-4 max-w-full text-sm w-[221px]">
    //     <div className="grow text-stone-500">Already have an account?</div>
    //     <Link to="/login" className="font-bold text-yellow-400 hover:underline">
    //       Login
    //     </Link>
    //   </div>
    // </div>
    <div className="container mt-5 flex flex-col rounded-none max-w-[416px] mx-auto sm:max-w-[500px] ">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6646851ad12990fecee190e5be75d604d70a729c850db264080b443c2f07a236?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
        alt="Register Illustration"
        className="object-contain self-center max-w-full aspect-[1.47] w-[80px] sm:w-[100px] md:w-[120px]"
      />

      <div className="self-center mt-5 text-sm text-stone-500 text-center sm:text-base">
        By signing up, you agree to our{" "}
        <span className="text-yellow-400">terms</span> &{" "}
        <span className="text-yellow-400">policy</span>
      </div>

      <form className="mt-5 w-full px-4 sm:px-6 md:px-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Input */}
        <div className="mt-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`px-2.5 py-4 mt-3 w-full text-md bg-white rounded-lg border ${errors.name ? "border-red-400" : "border-gray-300"
              } text-neutral-700 focus:ring focus:ring-yellow-300`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-2">*{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            className={`px-2.5 py-4 mt-3 w-full text-md bg-white rounded-lg border ${errors.email ? "border-red-400" : "border-gray-300"
              } text-neutral-700 focus:ring focus:ring-yellow-300`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-2">*{errors.email.message}</p>}
        </div>

        {/* Phone Number Input */}
        <div className="mt-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            maxLength={10}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Must be 10 digits and start with 6-9.",
              },
            })}
            className={`px-2.5 py-4 mt-3 w-full text-md bg-white rounded-lg border ${errors.phone ? "border-red-400" : "border-gray-300"
              } text-neutral-700 focus:ring focus:ring-yellow-300`}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-2">*{errors.phone.message}</p>}
        </div>

        {/* Password Input */}
        <div className="mt-4 relative">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" className="text-xs text-red-400">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className={`px-2.5 py-4 mt-3 w-full text-md bg-white rounded-lg border ${errors.password ? "border-red-400" : "border-gray-300"
                } text-neutral-700 focus:ring focus:ring-yellow-300`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg
                  className="inline-block align-middle cursor-pointer"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 576c-35.285 0-64-28.715-64-64s28.715-64 64-64c35.285 0 64 28.715 64 64s-28.715 64-64 64zM512 362.667c-82.342 0-149.331 66.987-149.331 149.333s66.989 149.333 149.331 149.333c82.347 0 149.333-66.987 149.333-149.333s-66.987-149.333-149.333-149.333zM521.374 725.231c-183.721 4.267-303.571-152.875-343.337-213.419 43.776-68.48 154.027-208.683 324.606-213.035 182.997-4.651 303.535 152.875 343.296 213.419-43.729 68.48-154.022 208.683-324.565 213.035zM933.026 490.778c-27.226-47.445-177.583-285.269-432.559-277.291-235.859 5.973-373.033 213.76-409.47 277.291-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 235.814-6.016 373.035-213.76 409.472-277.291 7.509-13.141 7.509-29.312 0-42.453z"></path>
                </svg>
              ) : (
                <svg
                  className="inline-block align-middle cursor-pointer"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 576c-35.285 0-64-28.715-64-64 0-0.559 0.132-1.105 0.26-1.651v0c0.115-0.499 0.235-0.998 0.252-1.506l66.645 66.645c-0.508 0.021-1.007 0.137-1.502 0.256-0.55 0.128-1.097 0.256-1.655 0.256zM200.834 140.501c-16.683-16.683-43.648-16.683-60.331 0s-16.683 43.648 0 60.331l240.213 240.213c-11.776 21.717-18.048 45.824-18.048 70.955 0 82.347 66.989 149.333 149.331 149.333 25.135 0 49.237-6.272 70.955-18.048l240.213 240.213c8.32 8.32 19.243 12.501 30.165 12.501 10.927 0 21.85-4.181 30.17-12.501 16.683-16.683 16.683-43.648 0-60.331l-682.669-682.667zM521.378 725.231c-183.682 4.267-303.575-152.875-343.341-213.419 19.499-30.464 52.181-75.093 97.408-115.669l-60.203-60.245c-64.939 59.264-106.581 124.032-124.245 154.88-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 50.517-1.28 96.256-12.203 137.685-28.587l-67.413-67.413c-22.827 6.059-46.848 10.069-72.448 10.709zM500.467 213.478c254.938-7.979 405.333 229.845 432.559 277.291 7.509 13.141 7.509 29.312 0 42.453-17.711 30.848-59.354 95.616-124.288 154.88l-60.207-60.245c45.231-40.576 77.956-85.205 97.408-115.669-39.761-60.544-160.213-218.027-343.292-213.419-25.604 0.64-49.621 4.651-72.495 10.709l-67.411-67.413c41.472-16.384 87.17-27.307 137.726-28.587z"></path>
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-2">*{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-white text-lg font-medium py-3 rounded-lg transition duration-200 ease-in-out sm:py-4"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>

  );
};

export default Register;
