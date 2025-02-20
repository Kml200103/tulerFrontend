import React, { useState, useEffect, useRef } from "react";
import "../../global.css";
import { Wheel } from "react-custom-roulette";
import { useGetWheelDataQuery } from "../../services/http/spinService";
import { useSelector } from "react-redux";

const SpinWheel = () => {
  const [spinData, setSpinData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [savedOffer, setSavedOffer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [winMessage, setWinMessage] = useState(""); // State for win message
  const [loginMessage, setLoginMessage] = useState(""); // State for login message
  const sidebarRef = useRef(null);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetWheelDataQuery();

  useEffect(() => {
    if (data?.offers?.length) {
      setSpinData(data.offers);
    }

    // Check if an offer is already saved in localStorage
    const storedOffer = JSON.parse(localStorage.getItem("savedOffer"));
    if (storedOffer) {
      setSavedOffer(storedOffer);
    }
  }, [data]);

  const handleSpinClick = () => {
    if (!isLoggedIn) {
      setLoginMessage("Please log in to apply the offer.");
      return; // Exit if not logged in
    } else {
      setLoginMessage(""); // Clear login message if logged in
    }

    if (!mustSpin && spinData.length > 0 && !savedOffer) {
      const randomIndex = Math.floor(Math.random() * spinData.length);
      setPrizeNumber(randomIndex);
      setMustSpin(true);
      setWinMessage(""); // Clear any previous win message
    }
  };

  const handleStopSpinning = () => {
    if (spinData.length > 0) {
      const wonOffer = spinData[prizeNumber];

      // Save the offer with ID to localStorage
      const offerToSave = { id: wonOffer._id, option: wonOffer.option };

      if (isLoggedIn) {
        localStorage.setItem("savedOffer", JSON.stringify(offerToSave));
      }
      setSavedOffer(offerToSave);

      // Set the win message
      setWinMessage(`You won: ${wonOffer.option}!`);

      // Send offerToSave to backend if required
      // sendOfferToBackend(offerToSave);
    }
    setMustSpin(false);
  };

  const wheelData = spinData?.length
    ? spinData.map((offer) => ({ option: offer.option }))
    : [];

  return (
    <div className="spin-wheel-page">
      <div className="spin-wheel-container">
        <div className="wheel-container">
          {isLoading ? (
            <p>Loading Spin Data...</p>
          ) : wheelData.length > 0 ? (
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              backgroundColors={["#ff5733", "#ffbe0b", "#ff8c42", "#ffb142"]}
              textColors={["#ffffff"]}
              onStopSpinning={handleStopSpinning}
              outerBorderColor={"#ffffff"}
              outerBorderWidth={6}
              radiusLineColor={"#ffffff"}
              radiusLineWidth={2}
              textDistance={75}
            />
          ) : (
            <p>No Offers Available</p>
          )}
        </div>
        <button
          className="spin-button"
          onClick={handleSpinClick}
          disabled={mustSpin || !!savedOffer}
        >
          {savedOffer
            ? `Offer: ${savedOffer?.option}`
            : mustSpin
            ? "Spinning..."
            : "Spin"}
        </button>
        {winMessage && <div className="win-message">{winMessage}</div>}{" "}
        {/* Display win message */}
        {loginMessage && (
          <div className="text-red-500 mt-2">{loginMessage}</div>
        )}{" "}
        {/* Display login message */}
      </div>
    </div>
  );
};

export default SpinWheel;
