import React, { Profiler, useState } from "react";
import AddressDetails from "../../components/AddressCard";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddressForm from "../../components/AddressForm";
import ProfileUpdateDialog from "../../components/UpdateForm";
import { Link } from "react-router";

const profileData = [
  { label: "Full Name", value: "John Doe" },
  { label: "Mobile Number", value: "+91-1234 5678 21" },
  { label: "Email ID", value: "JohnDoe256@gmail.com" },
];

const ProfilePage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditProfileDialog, setIsEditProfileDialog] = useState(false);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleOpenEditProfileDialog = () => {
    setIsEditProfileDialog(true);
  };

  const handleCloseEditProfileDialog = () => {
    setIsEditProfileDialog(false);
  };

  return (
    <div className="container flex flex-col max-w-[954px] rounded-[30px]">
      <div className="flex flex-col items-start px-11 pt-7 pb-72 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-5 max-md:pb-24 max-md:max-w-full ">
        <div className="flex gap-2">
          <h1 className="text-3xl font-semibold leading-loose text-neutral-700">
            Profile Details
          </h1>
          <PencilIcon
            className="h-6 w-6  mt-6 text-gray-500 cursor-pointer "
            onClick={handleOpenEditProfileDialog}
          />
        </div>
        {isEditProfileDialog && (
          <ProfileUpdateDialog onClose={handleCloseEditProfileDialog} />
        )}
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
            <button
              className="px-8 py-4 bg-yellow-400 rounded-[30px]"
              onClick={handleOpenAddDialog} // Open dialog on button click
            >
              + Add New Address
            </button>
            <Link to="/my-orders">
              {" "}
              {/* Link to My Orders page */}
              <button className="px-8 py-4 bg-blue-500 text-white rounded-[30px] ml-4">
                My Orders
              </button>
            </Link>
          </div>
        </div>
        {isAddDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 w-4/5 max-w-2xl h-auto relative">
              {" "}
              {/* Increased width */}
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl p-2" // Increased size
                onClick={handleCloseEditProfileDialog} // Close dialog on click
              >
                &times; {/* This is the "X" character */}
              </button>
            </div>
          </div>
        )}
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
                  onClick={handleOpenEditDialog}
                >
                  Edit
                </button>
              </div>
            </div>
            {isEditDialogOpen && ( // Assuming you have a state for edit dialog
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-5 w-4/5 max-w-2xl h-auto relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-4xl p-2" // Increased size
                    onClick={handleCloseEditDialog} // Close dialog on click
                  >
                    &times; {/* This is the "X" character */}
                  </button>
                  <AddressForm title="Edit" button="Update" />
                </div>
              </div>
            )}
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
                  onClick={handleOpenEditDialog}
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
