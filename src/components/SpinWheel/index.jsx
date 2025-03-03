import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "../../global.css";
import { Wheel } from "react-custom-roulette";
import { useGetWheelDataQuery } from "../../services/http/spinService";
import { useSelector } from "react-redux";

const SpinWheel = () => {
  const [spinData, setSpinData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [savedOffer, setSavedOffer] = useState(null);
  const [winMessage, setWinMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetWheelDataQuery();

  useEffect(() => {
    if (data && data.offers && data.offers.length) {
      setSpinData(data.offers);
    }

    try {
      const storedOffer = JSON.parse(localStorage.getItem("savedOffer"));
      if (storedOffer) {
        setSavedOffer(storedOffer);
      }
    } catch (error) {
      console.error("Error parsing savedOffer from localStorage:", error);
    }
  }, [data]);

  const handleSpinClick = useCallback(() => {
    if (!isLoggedIn) {
      setLoginMessage("Please log in to apply the offer.");
      return;
    } else if (loginMessage) {
      setLoginMessage("");
    }

    if (!mustSpin && spinData.length > 0 && !savedOffer) {
      const randomIndex = Math.floor(Math.random() * spinData.length);
      setPrizeNumber(randomIndex);
      setMustSpin(true);
      setWinMessage("");
    }
  }, [isLoggedIn, mustSpin, spinData, savedOffer, loginMessage]);

  const handleStopSpinning = useCallback(() => {
    if (spinData.length > 0) {
      const wonOffer = spinData[prizeNumber];
      const offerToSave = { id: wonOffer._id, option: wonOffer.option };

      if (isLoggedIn) {
        localStorage.setItem("savedOffer", JSON.stringify(offerToSave));
      }
      setSavedOffer(offerToSave);
      setWinMessage(`You won: ${wonOffer.option}!`);
    }
    setMustSpin(false);
  }, [spinData, prizeNumber, isLoggedIn]);

  const wheelData = useMemo(
    () =>
      spinData.length
        ? spinData.map((offer) => ({ option: offer.option }))
        : [],
    [spinData]
  );

  const buttonText = useMemo(() => {
    if (savedOffer) return `Offer: ${savedOffer?.option}`;
    if (mustSpin) return "Spinning...";
    return "Spin";
  }, [savedOffer, mustSpin]);

  return (
    <div
      className="spin-wheel-page"
      style={{
        backgroundImage: `url('/heather-barnes-CNDiESvWfrk-unsplash (1).webp')`, // Path to the image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="spin-wheel-container">
        {isLoading ? (
          <p>Loading Spin Data...</p>
        ) : wheelData.length > 0 ? (
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            backgroundColors={["#4CAF50", "#FFC107", "#2196F3", "#FF5722"]}
            textColors={["#FFFFFF", "#000000"]}
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

        <button
          className="spin-button"
          onClick={handleSpinClick}
          disabled={mustSpin || !!savedOffer}
        >
          {buttonText}
        </button>
        {winMessage && <div className="win-message">{winMessage}</div>}
        {loginMessage && <div className="text-black mt-2">{loginMessage}</div>}
      </div>
    </div>
  );
};

export default SpinWheel;
