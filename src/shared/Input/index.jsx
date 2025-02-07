import * as React from "react";

function InputField({ id, label, value, type, error }) {
  return (
    <>
      <label
        htmlFor={id}
        className="self-start text-xs font-medium text-neutral-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={value} // Use defaultValue instead of value for controlled input
        className={`px-2.5 py-5 mt-3 w-full text-xs whitespace-nowrap bg-white rounded-xl border ${
          error ? "border-red-400" : "border-gray-300"
        } border-solid text-neutral-700`}
        aria-label={label}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </>
  );
}

export default InputField;
