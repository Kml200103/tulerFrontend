import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddressForm from "../../components/AddressForm";
import ProfileUpdateDialog from "../../components/UpdateForm";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/auth/authSlice";
import { useGetUserQuery } from "../../services/http/userService";
import { del, get } from "../../services/http/axiosApi";
import AddressModal from "../../components/AddressModal";
import ConfirmModal from "../../components/ConfirmModal";
import { NotificationService } from "../../services/Notifcation";

const ProfilePage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [addressIdToRemove, setAddressIdToRemove] = useState(null);
  const [isEditProfileDialog, setIsEditProfileDialog] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useGetUserQuery();
  const user = useSelector((state) => state.auth.user);
  const id = user?.id;
  const userRole = user?.role;

  const navigate = useNavigate();

  localStorage.setItem("userRole", userRole);

  useEffect(() => {
    if (isError) {
      // Check if the error is due to token expiration
      if (isError) {
        dispatch(logout());
        navigate("/login");
      }
    } else if (data) {
      dispatch(login(data));
    }
  }, [data, isError, dispatch]);

  const handleRemove = async (id) => {
    try {
      const { receiveObj } = await del(`/address/${id}`);

      if (receiveObj.success) {
        NotificationService.sendSuccessMessage(`${receiveObj.message}`);
        await getAllAddress();
        setIsConfirmModalOpen(false);
      } else {
        console.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  const handleOpenConfirmModal = (id) => {
    setAddressIdToRemove(id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const getAllAddress = async () => {
    try {
      const { receiveObj } = await get(`/address/${id}`);
      setAddresses(receiveObj.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getAllAddress();
    }
  }, [id]);

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

  const handleOpenModal = (address = null) => {
    setSelectedAddress(address);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAddress(null);
    setModalOpen(false);
    getAllAddress();
  };

  const handleCloseEditProfileDialog = () => {
    setIsEditProfileDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const { receiveObj } = await del(`/remove/${id}`);
      if (receiveObj.success) {
        NotificationService.sendSuccessMessage(receiveObj.message);
        dispatch(logout());
        navigate("/login");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="container flex flex-col pt-[72px] md:pt-[96px] mt-4 max-w-[954px] min-h-screen flex-grow overflow-auto pb-20">
      <div className="flex flex-col items-start px-11 pt-7 pb-4 w-full bg-white rounded-[30px] shadow-[0px_1px_20px_rgba(0,0,0,0.1)] max-md:px-5 max-md:pb-4 max-md:max-w-full flex-grow">
        <div className="flex gap-2">
          <h1 className="text-3xl font-semibold leading-loose text-neutral-700">
            Profile Details
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

        <hr className="my-8 border-t border-gray-300 w-full" />

        <div>
          <div className="flex items-center justify-between gap-6 max-md:mt-10">
            {addresses.length > 0 && (
              <h2 className="text-3xl font-semibold leading-loose text-neutral-700">
                Saved Addresses
              </h2>
            )}
            <div className="flex text-lg font-medium text-black">
              <button
                className="px-8 py-4 bg-yellow-400 rounded-[30px]"
                onClick={() => handleOpenModal()}
              >
                + Add New Address
              </button>
              <Link to="/my-orders">
                <button className="px-8 py-4 bg-blue-500 text-white rounded-[30px] ml-4">
                  My Orders
                </button>
              </Link>
            </div>
          </div>

          {/* Conditionally render the address section */}
          {addresses.length > 0 && (
            <div className="mt-10 flex flex-col font-medium rounded-none w-full">
              <h3 className="mb-0 text-xl font-semibold leading-3 text-neutral-700 max-md:mt-14">
                Addresses
              </h3>
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-5 justify-between px-5 py-9 w-full bg-white shadow-sm mt-8"
                >
                  <div className="flex flex-col text-base text-black">
                    <div className="leading-6">
                      {address?.name} <br />
                      {address?.streetAddress}, <br />
                      {address.city}, {address.state}, {address.pincode}, <br />
                      {address.country}
                    </div>
                    <div className="mt-5">
                      Mobile: {address.phoneNumber || "N/A"}
                    </div>
                    <div className="flex justify-between mt-10 w-full">
                      <button
                        className="px-16 py-4 text-lg bg-yellow-400 rounded-[30px] max-md:px-5"
                        onClick={() => handleOpenModal(address)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col whitespace-nowrap">
                    <div className="self-end px-4 py-1.5 text-base bg-zinc-300 rounded-[30px] text-stone-500">
                      {address.addressType.charAt(0).toUpperCase() +
                        address.addressType.slice(1)}
                    </div>
                    <button
                      className="px-16 py-4 mt-[140px] text-lg bg-yellow-400 rounded-[30px] max-md:px-5"
                      onClick={() => handleOpenConfirmModal(address._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddressModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            initialValues={selectedAddress}
            button={"Update"}
          />

          <ConfirmModal
            open={isConfirmModalOpen}
            onClose={handleCloseConfirmModal}
            onConfirm={() => handleRemove(addressIdToRemove)}
            title="Confirm Cancellation"
            message="Are you sure you want to cancel this order?"
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="my-10 w-1/2 mx-auto flex flex-col gap-2">
        <button
          className="bg-red-500 text-white text-center flex items-center justify-center w-full px-4 py-2 rounded-xl"
          onClick={handleOpenDeleteAccountModal}
        >
          <span className="mr-2">Delete Account</span>
        </button>
        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          className="bg-gray-500 text-white text-center flex items-center justify-center w-full px-4 py-2 rounded-xl"
        >
          <span className="mr-2">Sign Out</span>
        </button>
      </div>

      <ConfirmModal
        open={isDeleteAccountModalOpen}
        onClose={handleCloseDeleteAccountModal}
        onConfirm={handleDeleteAccount}
        title="Confirm Account Deletion"
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
    </div>
  );
};

export default ProfilePage;
