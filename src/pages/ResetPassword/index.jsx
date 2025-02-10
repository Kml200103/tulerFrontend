import { useState } from "react";
import { useForm } from "react-hook-form";

export const ResetPassword = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  //   const router = useRouter();
  //   const { email, token } = router.query;

  //   const hasValidatedToken = useRef(false); // Ref to track if token has been validated

  //   const validateToken = async () => {
  //     try {
  //       const { receiveObj } = await post(
  //         `/user/validate-reset-token/${email}/${token}`,
  //         token
  //       );
  //       console.log(receiveObj);

  //       if (receiveObj.status === false) {
  //         NotificationService.sendErrorMessage("Invalid or expired token.");
  //         router.push("/forgot-password/user");
  //       } else if (receiveObj.status === true) {
  //         router.push(`/reset-password/user?email=${email}&token=${token}`);
  //       }
  //     } catch (error) {
  //       NotificationService.sendErrorMessage(
  //         "An error occurred while validating the token."
  //       );
  //       router.push("/forgot-password/user");
  //     }
  //   };

  //   useEffect(() => {
  //     if (!email || !token) {
  //       router.push("/forgot-password/user");
  //       return;
  //     }
  //     if (!hasValidatedToken.current && email && token) {
  //       hasValidatedToken.current = true; // Mark as validated
  //       validateToken(); // Call the validateToken function
  //     }
  //   }, [email, token, router]);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#\$%\^&\*]/.test(password);

    if (!minLength) return "Password must be at least 8 characters";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasLowercase)
      return "Password must contain at least one lowercase letter";
    if (!hasUppercase)
      return "Password must contain at least one uppercase letter";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";
    return true;
  };

  const handleResetPassword = async (data) => {
    console.log(data);

    // try {
    //   const { receiveObj } = await post(
    //     `/user/reset-password/${email}/${token}`,
    //     { password: newPassword }
    //   );

    //   if (receiveObj.status === true) {
    //     NotificationService.sendInfoMessage(receiveObj.message);
    //     router.push("/login");
    //   } else {
    //     NotificationService.sendErrorMessage(receiveObj.message);
    //   }
    // } catch (error) {
    //   NotificationService.sendErrorMessage(
    //     "An error occurred while resetting your password."
    //   );
    // }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(handleResetPassword)}
        >
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="mt-2 relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("newPassword", {
                  required: "New Password is required",
                  validate: validatePassword,
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-2"
              >
                {showNewPassword ? (
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
            </div>
            {errors.newPassword && (
              <p className="text-red-600 mt-2 text-sm">
                *{errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="mt-2 relative">
              <input
                id="confirmPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                autoComplete="confirm-password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("newPassword") ||
                    "The passwords do not match",
                })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2 font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute right-2 top-2"
              >
                {showConfirmNewPassword ? (
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
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 mt-2 text-sm">
                *{errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-yellow-400 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
