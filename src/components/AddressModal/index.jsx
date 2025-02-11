import React, { useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useSelector } from "react-redux";
import { post } from "../../services/http/axiosApi";

const AddressModal = ({ isOpen, onClose, initialValues, button }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { id } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmit = async (data) => {
    const payload = { ...data, userId: id };
    const endpoint = initialValues ? `/address/add/${id}/${data._id}` : `/address/add/${id}`;

    try {
      const { receiveObj } = await post(endpoint, payload);
      if (receiveObj.success) {
        NotificationService.sendInfoMessage(receiveObj.message);
        onClose();
      } else {
        NotificationService.sendErrorMessage("Error processing the address.");
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      NotificationService.sendErrorMessage("An error occurred while processing the address.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} open={isOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">✖</button>
              <DialogTitle className="text-xl font-semibold text-gray-900 text-center">{button} Address</DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {/* Name */}
                <div>
                  <label className="block font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter Name"
                    className={`w-full p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">*{errors.name.message}</p>}
                </div>

                {/* Street */}
                <div>
                  <label className="block font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    {...register("streetAddress", { required: "Street address is required" })}
                    placeholder="Enter Street"
                    className={`w-full p-2 border ${errors.streetAddress ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm mt-1">*{errors.streetAddress.message}</p>}
                </div>

                {/* City & State */}
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      {...register("city", { required: "City is required" })}
                      placeholder="Enter City"
                      className={`w-full p-2 border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">*{errors.city.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      {...register("state", { required: "State is required" })}
                      placeholder="Enter State"
                      className={`w-full p-2 border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">*{errors.state.message}</p>}
                  </div>
                </div>
                {/* Country & Pincode */}
                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-gray-700">Country</label>
                    <select
                      {...register("country", { required: "Country is required" })}
                      className={`w-full p-2 border ${errors.country ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-sm mt-2">*{errors.country.message}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      {...register("pincode", { required: "Pincode is required" })}
                      placeholder="Enter Pincode"
                      className={`w-full p-2 border ${errors.pincode ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-2">*{errors.pincode.message}</p>}
                  </div>
                </div>

                {/* Address Type */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Address Type</label>
                  <div className="flex space-x-4">
                    <div>
                      <input type="radio" value="home" {...register("addressType", { required: "Address type is required" })} id="home" className="mr-2" />
                      <label htmlFor="home" className="text-gray-700">Home</label>
                    </div>
                    <div>
                      <input type="radio" value="office" {...register("addressType", { required: "Address type is required" })} id="office" className="mr-2" />
                      <label htmlFor="office" className="text-gray-700">Office</label>
                    </div>
                  </div>
                  {errors.addressType && <p className="text-red-500 text-sm mt-2">*{errors.addressType.message}</p>}
                </div>


                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">{button} Address</button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddressModal;
