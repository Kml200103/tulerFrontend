import * as React from "react";
import { FormInput } from "./FormInput";

function FeedbackForm() {
  const formFields = [
    { label: "Name", type: "text", id: "name" },
    { label: "Email", type: "email", id: "email" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col text-xl font-medium rounded-none max-w-[845px] text-neutral-700">
      {" "}
      {/* Reduced max width */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start px-8 pt-5 pb-20 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-4 max-md:pb-16 max-md:max-w-full"
      >
        <h1 className="text-2xl font-semibold leading-loose text-neutral-700 max-md:max-w-full">
          How can we improve your experience?
        </h1>

        <div className="flex text-xl flex-wrap gap-6 self-stretch mt-8 max-md:mt-8 max-md:max-w-full">
          {formFields.map((field) => (
            <FormInput
              key={field.id}
              label={field.label}
              type={field.type}
              id={field.id}
            />
          ))}
        </div>

        <div className="w-full">
          <label htmlFor="subject" className="block mt-7">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className="flex shrink-0 self-stretch mt-4 h-10 w-full bg-white rounded-xl border border-gray-300 border-solid max-md:max-w-full"
          />
        </div>

        <div className="w-full">
          <label htmlFor="description" className="block mt-7">
            Description
          </label>
          <textarea
            id="description"
            className="flex shrink-0 self-stretch mt-4 w-full bg-white rounded-xl border border-gray-300 border-solid h-[100px] max-md:max-w-full"
          />
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
