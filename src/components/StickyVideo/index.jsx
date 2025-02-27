import { useState, useRef, useCallback } from "react";

const StickyVideo = () => {
  const [playing, setPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const videoRef = useRef(null);

  const handleVideoClick = useCallback(() => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-0 right-0 p-2 transition-all duration-300 z-50`}>
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        className={`w-auto h-40 cursor-pointer`}
        onClick={handleVideoClick}
        controls
        loop
        poster="placeholder.jpg" // Add a poster image
        preload="metadata" // Load metadata first
        aria-label="Sticky video"
      />
      <button
        onClick={handleClose}
        className="absolute top-0 right-1 m-2 text-white text-3xl"
        aria-label="Close sticky video"
      >
        &times;
      </button>
    </div>
  );
};

export default StickyVideo;