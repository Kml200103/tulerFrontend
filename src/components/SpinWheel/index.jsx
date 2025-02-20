import React, { useState, useEffect, useRef } from "react";
import "../../global.css";
import { Wheel } from "react-custom-roulette";
import { useGetWheelDataQuery } from "../../services/http/spinService";

const SpinWheel = () => {
    const [spinData, setSpinData] = useState([]);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [savedOffer, setSavedOffer] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

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
        if (!mustSpin && spinData.length > 0 && !savedOffer) {
            const randomIndex = Math.floor(Math.random() * spinData.length);
            setPrizeNumber(randomIndex);
            setMustSpin(true);
        }
    };

    const handleStopSpinning = () => {
        if (spinData.length > 0) {
            const wonOffer = spinData[prizeNumber];

        
            // Save the offer with ID to localStorage
            const offerToSave = { id: wonOffer._id, option: wonOffer.option };
            localStorage.setItem("savedOffer", JSON.stringify(offerToSave));
            setSavedOffer(offerToSave);

            // Send offerToSave to backend if required
            // sendOfferToBackend(offerToSave);

            alert(`You won: ${wonOffer.option}!`);
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
                <button className="spin-button" onClick={handleSpinClick} disabled={mustSpin || !!savedOffer}>
                    {savedOffer ? `Offer: ${savedOffer?.option}` : mustSpin ? "Spinning..." : "Spin"}
                </button>
            </div>
        </div>
    );
};

export default SpinWheel;
