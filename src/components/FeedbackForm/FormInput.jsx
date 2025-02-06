import * as React from "react";

export function FormInput({ label, type, id }) {
  return (
    <div className="flex flex-col flex-1 grow shrink-0 basis-0 w-fit">
      <label htmlFor={id} className="self-start">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        className="flex shrink-0 mt-6 h-12 w-full bg-white rounded-xl border border-gray-300 border-solid"
      />
    </div>
  );
}
