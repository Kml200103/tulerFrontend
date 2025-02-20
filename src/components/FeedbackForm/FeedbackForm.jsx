import axios from "axios";
import * as React from "react";
import { useForm } from "react-hook-form";
import { NotificationService } from "../../services/Notifcation";
import { classNames } from "../../utils/classNames";
import { post } from "../../services/http/axiosApi";

export function FormInput({ label, type, id, register, errors, className }) {
  return (
    <div className="flex flex-col flex-1 grow shrink-0 basis-0 w-fit">
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
          `${className} flex shrink-0 mt-6 h-12 w-full bg-white rounded-xl border border-gray-300 border-solid`
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
    <div className="flex flex-col text-xl font-medium rounded-none max-w-[845px] text-neutral-700">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start px-8 pt-5 pb-20 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-4 max-md:pb-16 max-md:max-w-full"
      >
        <h1 className="text-2xl font-semibold leading-loose text-neutral-700 max-md:max-w-full">
          How can we improve your experience?
        </h1>

        <div className="flex text-xl flex-wrap gap-6 self-stretch mt-8 max-md:mt-8 max-md:max-w-full">
          <FormInput
            label="Name"
            type="text"
            id="name"
            register={register}
            errors={errors}
            className={"p-2"}
          />
          <FormInput
            label="Email"
            type="email"
            id="email"
            register={register}
            errors={errors}
            className={"p-2"}
          />
        </div>

        <div className="w-full">
          <label htmlFor="subject" className="block mt-7">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            {...register("subject", {
              required: "Subject is required",
              minLength: {
                value: 10,
                message: "Subject must be at least 5 characters",
              },
            })}
            className="p-2 flex shrink-0 self-stretch mt-4 h-10 w-full bg-white rounded-xl border border-gray-300 border-solid max-md:max-w-full"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              *{errors.subject.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="description" className="block mt-7">
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
            className=" p-2 flex shrink-0 self-stretch mt-4 w-full bg-white rounded-xl border border-gray-300 border-solid h-[100px] max-md:max-w-full"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              *{errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-10 py-3 mt-8 mb-0 text-lg text-black whitespace-nowrap bg-yellow-400 rounded-[30px] max-md:px-4 max-md:mt-8 max-md:mb-2.5"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
