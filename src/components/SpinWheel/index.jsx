import React, { useState, useEffect, useRef } from "react";
import "../../global.css";
import { Wheel } from "react-custom-roulette";
import { useGetWheelDataQuery } from "../../services/http/spinService";

const SpinWheel = () => {
    // const wheelData = [
    //     { option: "10% OFF" },
    //     { option: "₹50 OFF" },
    //     { option: "20% OFF" },
    //     { option: "₹100 OFF" },
    //     { option: "15% OFF" },
    //     { option: "₹25 OFF" },
    //     { option: "5% OFF" },
    //     { option: "₹75 OFF" },
    // ];

    const[wheelData,setWheelData]=useState([])
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [savedOffers, setSavedOffers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data, isError, isLoading,isSuccess } = useGetWheelDataQuery()
    const sidebarRef = useRef(null);

    
    useEffect(() => {
        if(data){
            setWheelData(data?.offers)
        }
        const storedOffers = JSON.parse(localStorage.getItem("savedOffers")) || [];
        setSavedOffers(storedOffers);
    }, []);

    useEffect(() => {
        localStorage.setItem("savedOffers", JSON.stringify(savedOffers));
    }, [savedOffers]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const randomIndex = Math.floor(Math.random() * wheelData.length);
            setPrizeNumber(randomIndex);
            setMustSpin(true);
        }
    };

    const handleStopSpinning = () => {
        const wonOffer = wheelData[prizeNumber].option;
        setSavedOffers((prev) => [...prev, wonOffer]);
        alert(`You won: ${wonOffer}!`);
        setMustSpin(false);
    };

    return (
        <div className="spin-wheel-page">
            {/* Header */}


            <div className="spin-wheel-container">
                <div className="wheel-container">
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
                </div>
                <button className="spin-button" onClick={handleSpinClick} disabled={mustSpin}>
                    {mustSpin ? "Spinning..." : "Spin"}
                </button>
            </div>

            {/* Sidebar
            {isSidebarOpen && (
                <div className="sidebar-overlay">
                    <div className="sidebar" ref={sidebarRef}>
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            &times;
                        </button>
                        <h2>Saved Offers</h2>
                        <ul>
                            {savedOffers.length > 0 ? (
                                savedOffers.map((offer, index) => <li key={index}>{offer}</li>)
                            ) : (
                                <p>No offers saved yet.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default SpinWheel;
