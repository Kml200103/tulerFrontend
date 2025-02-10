import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { NotificationService } from "../../services/Notifcation";
import { useLoginUserMutation } from "../../services/http/userService";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation()

  const { isLoggedIn } = useSelector((state) => state.auth);


  const onSubmit = async (data) => {

    await loginUser(data).then((res) => {
      if (res?.data) {
        localStorage.setItem("userToken", res?.data?.token)
      }
      if (res.data.success) {


        NotificationService.sendSuccessMessage("Login successful!");
        navigate("/profile");
      }
      else {
        NotificationService.sendErrorMessage("Login failed. Please try again.");
      }
    })

  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="container flex flex-col mt-4 rounded-none max-w-[416px]">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6646851ad12990fecee190e5be75d604d70a729c850db264080b443c2f07a236?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
        alt="Login Illustration"
        className="object-contain self-center max-w-full aspect-[1.47] w-[100px]"
      />
      <div className="self-center mt-7 text-sm text-stone-500">
        Login with your email & password
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <div className="mt-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${errors.email ? "border-red-400" : "border-gray-300"
              } border-solid text-neutral-700`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-3">*{errors.email.message}</p>
          )}
        </div>
        {/* Password input */}
        {/* <div className="mt-4 relative">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a href="#" className="text-xs text-red-400">
              Forgot Password?
            </a>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
            })}
            autoComplete="current-password"
            className={`px-2.5 py-5 mt-3 w-full text-xs whitespace-nowrap bg-white rounded-xl border ${
              errors.password ? "border-red-400" : "border-gray-300"
            } border-solid text-neutral-700`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2"
          >
            {showPassword ? (
              <svg
                className="inline-block align-middle cursor-pointer"
                width="1.3rem"
                height="1.3rem"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512 576c-35.285 0-64-28.715-64-64s28.715-64 64-64c35.285 0 64 28.715 64 64s-28.715 64-64 64zM512 362.667c-82.342 0-149.331 66.987-149.331 149.333s66.989 149.333 149.331 149.333c82.347 0 149.333-66.987 149.333-149.333s-66.987-149.333-149.333-149.333zM521.374 725.231c-183.721 4.267-303.571-152.875-343.337-213.419 43.776-68.48 154.027-208.683 324.606-213.035 182.997-4.651 303.535 152.875 343.296 213.419-43.729 68.48-154.022 208.683-324.565 213.035zM933.026 490.778c-27.226-47.445-177.583-285.269-432.559-277.291-235.859 5.973-373.033 213.76-409.47 277.291-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 235.814-6.016 373.035-213.76 409.472-277.291 7.509-13.141 7.509-29.312 0-42.453z"></path>
              </svg>
            ) : (
              <svg
                className="inline-block align-middle cursor-pointer"
                width="1.3rem"
                height="1.3rem"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512 576c-35.285 0-64-28.715-64-64 0-0.559 0.132-1.105 0.26-1.651v0c0.115-0.499 0.235-0.998 0.252-1.506l66.645 66.645c-0.508 0.021-1.007 0.137-1.502 0.256-0.55 0.128-1.097 0.256-1.655 0.256zM200.834 140.501c-16.683-16.683-43.648-16.683-60.331 0s-16.683 43.648 0 60.331l240.213 240.213c-11.776 21.717-18.048 45.824-18.048 70.955 0 82.347 66.989 149.333 149.331 149.333 25.135 0 49.237-6.272 70.955-18.048l240.213 240.213c8.32 8.32 19.243 12.501 30.165 12.501 10.927 0 21.85-4.181 30.17-12.501 16.683-16.683 16.683-43.648 0-60.331l-682.669-682.667zM521.378 725.231c-183.682 4.267-303.575-152.875-343.341-213.419 19.499-30.464 52.181-75.093 97.408-115.669l-60.203-60.245c-64.939 59.264-106.581 124.032-124.245 154.88-7.552 13.141-7.552 29.312 0 42.453 26.837 46.805 171.904 277.419 422.057 277.419 3.499 0 7.002-0.043 10.5-0.128 50.517-1.28 96.256-12.203 137.685-28.587l-67.413-67.413c-22.827 6.059-46.848 10.069-72.448 10.709zM500.467 213.478c254.938-7.979 405.333 229.845 432.559 277.291 7.509 13.141 7.509 29.312 0 42.453-17.711 30.848-59.354 95.616-124.288 154.88l-60.207-60.245c45.231-40.576 77.956-85.205 97.408-115.669-39.761-60.544-160.213-218.027-343.292-213.419-25.604 0.64-49.621 4.651-72.495 10.709l-67.411-67.413c41.472-16.384 87.17-27.307 137.726-28.587z"></path>
              </svg>
            )}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-3">
              *{errors.password.message}
            </p>
          )}
        </div> */}
        <div className="mt-4 relative">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a href="#" className="text-xs text-red-400">
              Forgot Password?
            </a>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
            })}
            autoComplete="current-password"
            className={`px-2.5 py-5 mt-3 w-full text-md whitespace-nowrap bg-white rounded-xl border ${errors.password ? "border-red-400" : "border-gray-300"
              } border-solid text-neutral-700`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 mt-4 top-1/2 transform -translate-y-1/2"
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
          {errors.password && (
            <p className="text-red-400 text-sm mt-3">
              *{errors.password.message}
            </p>
          )}
        </div>
        <button className="px-16 py-4 mt-6 w-full text-xs font-semibold whitespace-nowrap bg-yellow-400 rounded-xl text-neutral-700">
          Login
        </button>
      </form>

      <div className="flex gap-4 items-center mt-8 text-sm text-black whitespace-nowrap">
        <div className="flex shrink-0 self-stretch my-auto h-px bg-gray-300 w-[182px]" />
        <div className="self-stretch">Or</div>
        <div className="flex shrink-0 self-stretch my-auto h-px bg-gray-300 w-[182px]" />
      </div>

      <button
        className={`flex flex-col justify-center items-center text-white px-16 py-4 mt-6 w-full text-xs font-semibold rounded-xl bg-blue-500`}
      >
        <div className="flex gap-1.5 ml-4 max-w-full w-[132px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0c11426c7e37de9f78550ac6ccb717b8b49e2895120be1d8b8a593878f5f7bf?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
            alt=""
            className="object-contain shrink-0 self-start w-3 aspect-square"
          />
          <div className="grow shrink w-28 ">Login with Google</div>
        </div>
      </button>

      <button
        className={`flex flex-col justify-center items-center px-16 py-4 mt-7 w-full text-xs font-semibold rounded-xl bg-gray-500 text-white`}
      >
        <div className="flex gap-1.5 ml-4 max-w-full w-[132px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cefdeaa1ad2b0b9e9fc82c0ec1baa049494ee43d1cae7057f44e4216f287e29d?placeholderIfAbsent=true&apiKey=712c726234fd496ca29d49faeda0af47"
            alt=""
            className="object-contain shrink-0 self-start w-3 aspect-square"
          />
          <div className="grow shrink w-28">Login with Mobile </div>
        </div>
      </button>
      <div className="flex shrink-0 mt-10 w-full h-px bg-gray-300" />

      <div className="flex self-center mt-6 max-w-full text-sm w-[221px]">
        <div className="grow text-stone-500">Don't have any account?&nbsp;</div>
        <Link
          to="/register"
          className="font-bold text-yellow-400 hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
