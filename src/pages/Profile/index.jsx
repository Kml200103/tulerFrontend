import React from "react";
import AddressDetails from "../../components/AddressCard";

const profileData = [
  { label: "Full Name", value: "John Doe" },
  { label: "Mobile Number", value: "+91-1234 5678 21" },
  { label: "Email ID", value: "JohnDoe256@gmail.com" },
  { label: "Gender", value: "Female" },
];

const ProfilePage = () => {
  return (
    <div className="container flex flex-col max-w-[954px] rounded-[30px]">
      <div className="flex flex-col items-start px-11 pt-7 pb-72 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <h1 className="text-3xl font-semibold leading-loose text-neutral-700">
          Profile Details
        </h1>
        <div className="mt-16 w-full max-w-[653px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[38%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-start text-xl font-medium text-neutral-700 max-md:mt-10">
                {profileData.map((item, index) => (
                  <div
                    key={index}
                    className={index > 0 ? "mt-11 max-md:mt-10" : ""}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[62%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-start text-xl font-medium text-neutral-700 max-md:mt-10">
                {profileData.map((item, index) => (
                  <div
                    key={index}
                    className={index > 0 ? "mt-11 max-md:mt-10" : ""}
                  >
                    {item.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Separator between Profile Details and Saved Addresses */}
        <hr className="my-8 border-t border-gray-300 w-full" />

        <div className="flex items-center justify-between  gap-6 max-md:mt-10">
          <h2 className="text-3xl font-semibold leading-loose text-neutral-700">
            Saved Addresses
          </h2>
          <div className="flex text-lg font-medium text-black">
            <button className="px-8 py-4 bg-yellow-400 rounded-[30px]">
              + Add New Address
            </button>
          </div>
        </div>

        <h3 className="mt-14 text-xl font-semibold leading-3 text-neutral-700 max-md:mt-10">
          Default Address
        </h3>
        <div className="mt-10 flex flex-col font-medium rounded-none w-full">
          <div className="flex flex-wrap gap-5 justify-between px-5 py-9 w-full bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.15)] max-md:pr-5 max-md:max-w-full">
            <div className="flex flex-col text-base text-black">
              <div className="leading-6">
                456 Elm Street, Suite 3, <br />
                Los Angeles, CA, 90001, <br />
                USA
              </div>
              <div className="mt-5">Mobile: +91-1234 5678 21</div>
              <div className="flex justify-between mt-10 w-full">
                <button
                  className={`px-16 py-4 text-lg whitespace-nowrap bg-yellow-400 rounded-[30px] max-md:px-5`}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="self-end px-4 py-1.5 text-base bg-zinc-300 rounded-[30px] text-stone-500">
                Home
              </div>
              <button
                className={`px-16 py-4 mt-[120px] text-lg whitespace-nowrap bg-yellow-400 rounded-[30px] max-md:px-5`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col font-medium rounded-none w-full">
          <h3 className=" mb-0  text-xl font-semibold leading-3 text-neutral-700 max-md:mt-14 max-md:mb -2.5">
            Other Address
          </h3>
          <div className="flex flex-wrap gap-5 justify-between px-5 py-9 w-full bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.15)] max-md:pr-5 max-md:max-w-full mt-8">
            <div className="flex flex-col text-base text-black">
              <div className="leading-6">
                456 Elm Street, Suite 3, <br />
                Los Angeles, CA, 90001, <br />
                USA
              </div>
              <div className="mt-5">Mobile: +91-1234 5678 21</div>
              <div className="flex justify-between mt-10 w-full">
                <button
                  className={`px-16 py-4 text-lg whitespace-nowrap bg-yellow-400 rounded-[30px] max-md:px-5`}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="self-end px-4 py-1.5 text-base bg-zinc-300 rounded-[30px] text-stone-500">
                Home
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
