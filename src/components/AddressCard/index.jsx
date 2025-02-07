import React from "react";

function AddressDetails({
  street,
  suite,
  city,
  state,
  zipCode,
  country,
  mobile,
}) {
  return (
    <div className="flex flex-col text-base text-black">
      <div className="leading-6">
        {street}, {suite}, <br />
        {city}, {state} {zipCode}, <br />
        {country}
      </div>
      <div className="mt-5">Mobile: {mobile}</div>
      {/* Wrap the buttons in a flex container */}
      <div className="flex justify-between mt-10">
        <button
          className={`px-16 py-4 text-lg whitespace-nowrap bg-yellow-400 rounded-[30px] max-md:px-5`}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default AddressDetails;
