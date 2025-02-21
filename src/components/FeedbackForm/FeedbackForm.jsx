import axios from "axios";
import * as React from "react";
import { useForm } from "react-hook-form";
import { NotificationService } from "../../services/Notifcation";
import { classNames } from "../../utils/classNames";
import { post } from "../../services/http/axiosApi";

export function FormInput({ label, type, id, register, errors, className }) {
  return (
    <div className="flex flex-col w-full"> {/* Make input container full width */}
      <label htmlFor={id} className="self-start">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id, {
          required: `${label} is required`,
          pattern:
            id === "email"
              ? {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                }
              : undefined,
        })}
        className={classNames(
          `${className} flex mt-2 h-12 w-full bg-white rounded-xl border border-gray-300 border-solid p-2` // Added p-2 for padding
        )}
      />
      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">*{errors[id]?.message}</p>
      )}
    </div>
  );
}

function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { receiveObj } = await post("/feedback", data);
      if (receiveObj.status == true) {
        NotificationService.sendSuccessMessage(receiveObj.message);
        reset();
      }
    } catch (error) {
      NotificationService.sendErrorMessage(
        "Failed to submit feedback. Please try again."
      );
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="flex flex-col text-xl font-medium rounded-none text-neutral-700 w-full px-4 md:px-0"> {/* Added w-full and responsive padding */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] p-6 md:p-8" // Responsive padding
      >
        <h1 className="text-2xl font-semibold leading-loose text-neutral-700 w-full mb-4"> {/* Added w-full and margin-bottom */}
          How can we improve your experience?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"> {/* Use grid for responsiveness */}
          <FormInput
            label="Name"
            type="text"
            id="name"
            register={register}
            errors={errors}
            className={""} // Removed unnecessary className
          />
          <FormInput
            label="Email"
            type="email"
            id="email"
            register={register}
            errors={errors}
            className={""} // Removed unnecessary className
          />
        </div>

        <div className="w-full mt-4"> {/* Added margin-top */}
          <label htmlFor="subject" className="block">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            {...register("subject", {
              required: "Subject is required",
              minLength: {
                value: 10,
                message: "Subject must be at least 10 characters",
              },
            })}
            className="p-2 flex w-full mt-2 h-10 bg-white rounded-xl border border-gray-300 border-solid"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              *{errors.subject.message}
            </p>
          )}
        </div>

        <div className="w-full mt-4"> {/* Added margin-top */}
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            className="p-2 flex w-full mt-2 bg-white rounded-xl border border-gray-300 border-solid h-[100px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              *{errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-10 py-3 mt-6 w-full text-lg text-black whitespace-nowrap bg-yellow-400 rounded-[30px]" // Added w-full and margin-top
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;