import { useState, useRef } from "react";

const StickyVideo = () => {
  const [playing, setPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // State to control visibility
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null; // If closed, return null

  return (
    <div
      className={`fixed bottom-0 right-0 p-2 transition-all duration-300 z-50`}
    >
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Test video link
        className={`w-auto h-40 cursor-pointer`} // Fixed height for simplicity
        onClick={handleVideoClick}
        controls // Optional: Add controls for better user experience
        loop 
      />
      <button
        onClick={handleClose}
        className="absolute top-0 right-1 m-2 text-white text-3xl"
        aria-label="Close video"
      >
        &times; {/* This is the "X" icon */}
      </button>
    </div>
  );
};

export default StickyVideo;
