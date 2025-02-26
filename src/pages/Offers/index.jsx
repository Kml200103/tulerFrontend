import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { del, get, post } from "../../services/http/axiosApi";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { option: "", type: "percentage", value: "" } });

  // Fetch Offers (Only on Mount)
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const { receiveObj } = await get(
        "/offer",
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      setOffers(receiveObj?.offers || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  }, []);

  // Add or Edit Offer
  const onSubmit = async (data) => {
    try {
      if (isEdit && selectedOffer) {
        const { receiveObj } = await post(`/offer/${selectedOffer._id}`, data, {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        });
        setOffers((prevOffers) =>
          prevOffers.map((offer) =>
            offer._id === selectedOffer._id ? receiveObj?.offer : offer
          )
        );
      } else {
        const { receiveObj } = await post("/offer/add", data, {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        });
        setOffers((prevOffers) => [...prevOffers, receiveObj.offer]);
      }
      resetForm();
    } catch (error) {
      console.error("Error processing offer:", error);
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (offerId) => {
    try {
      await del(
        `/offer/${offerId}`,
        {},
        { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      );
      setOffers((prevOffers) =>
        prevOffers.filter((offer) => offer._id !== offerId)
      );
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  // Reset form & selection
  const resetForm = () => {
    reset();
    setSelectedOffer(null);
    setIsEdit(false);
  };

  // Set Form Data for Editing
  const handleEditClick = (offer) => {
    setIsEdit(true);
    setSelectedOffer(offer);
    setValue("option", offer.option);
    setValue("type", offer.type);
    setValue("value", offer.value);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Offer Management</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Option (e.g., 10% OFF)"
              className="border p-2 rounded w-full"
              {...register("option", { required: "Option is required" })}
            />
            {errors.option && (
              <p className="text-red-500 text-sm">{errors.option.message}</p>
            )}
          </div>

          <div>
            <select className="border p-2 rounded w-full" {...register("type")}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Value"
              className="border p-2 rounded w-full"
              {...register("value", {
                required: "Value is required",
                min: { value: 1, message: "Value must be at least 1" },
              })}
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="text-blue-500 hover:underline px-4 py-2 rounded mt-3"
        >
          {isEdit ? "Update Offer" : "Add Offer"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Offers List</h2>
      <ul className="border rounded p-4 mb-6">
        {offers.length === 0 ? (
          <p className="text-gray-500">No offers available</p>
        ) : (
          offers.map((offer) => (
            <li
              key={offer._id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {offer.option} -{" "}
                {offer.type === "percentage"
                  ? `${offer.value}%`
                  : `₹${offer.value}`}
              </span>
              <div>
                <button
                  onClick={() => {
                    if (isEdit && selectedOffer?._id === offer._id) {
                      resetForm();
                    } else {
                      handleEditClick(offer);
                    }
                  }}
                  className={`px-2 py-1 rounded mr-2 text-white ${
                    isEdit && selectedOffer?._id === offer._id
                      ? "text-red-500 hover:underline"
                      : "text-yellow-500 hover:underline"
                  }`}
                >
                  {isEdit && selectedOffer?._id === offer._id
                    ? "Close"
                    : "Edit"}
                </button>

                <button
                  onClick={() => handleDeleteOffer(offer._id)}
                  className="text-red-500 hover:underline px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default OfferManagement;
