import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";

import ProfileUpdateDialog from "../UpdateForm";
import { login, logout } from "../../redux/auth/authSlice";
import { useGetUserQuery } from "../../services/http/userService";

const AdminProfile = () => {
  const [isEditProfileDialog, setIsEditProfileDialog] = useState(false);
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useGetUserQuery();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (isError) {
      dispatch(logout()); // Dispatch the logout action
    } else if (data) {
      dispatch(login(data)); // Log in user if data is valid
    }
  }, [data, isError, dispatch]);

  // Check if data is available and handle it safely
  const profileData = data?.user
    ? [
        {
          label: "Full Name",
          value:
            data.user.name.charAt(0).toUpperCase() + data.user.name.slice(1),
        },
        { label: "Mobile Number", value: data.user.phone || "N/A" },
        { label: "Email ID", value: data.user.email || "N/A" },
      ]
    : [];

  const handleOpenEditProfileDialog = () => {
    setIsEditProfileDialog(true);
  };

  const handleCloseEditProfileDialog = () => {
    setIsEditProfileDialog(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (isError) {
    return <div>Error loading profile data.</div>; // Show error state
  }

  return (
    <div className="container flex flex-col max-w-[954px] rounded-[30px] my-20">
      <div className="flex flex-col items-start px-11 pt-7 pb-72 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-5 max-md:pb-24 max-md:max-w-full">
        <div className="flex gap-2">
          <h1 className="text-3xl font-semibold leading-loose text-neutral-700">
            Admin Profile Details
          </h1>
          <PencilIcon
            className="h-6 w-6 mt-6 text-gray-500 cursor-pointer"
            onClick={handleOpenEditProfileDialog}
          />
        </div>

        {isEditProfileDialog && (
          <ProfileUpdateDialog
            onClose={handleCloseEditProfileDialog}
            userData={data?.user}
          />
        )}

        <div className="mt-16 w-full max-w-[653px] max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col gap-6">
            {profileData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center"
              >
                <div className="w-[38%] text-xl font-medium text-neutral-700">
                  {item.label}
                </div>
                <div className="w-[62%] text-xl font-medium text-neutral-700 md:ml-5 mt-2 md:mt-0">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
