import React, { useState, useEffect } from "react";
import axios from "axios";

// Utilize environment variables for API base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function WatchedButton({
  user,
  media,
  mediaType,
  addToWatchedText,
  removeFromWatchedText,
  isInWatched,
}) {
  const [isWatched, setIsWatched] = useState(isInWatched);

  useEffect(() => {
    setIsWatched(isInWatched); // Synchronize state with prop changes
  }, [isInWatched]);

  const toggleWatchedStatus = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }

    const method = isWatched ? "delete" : "put";
    const url = isWatched
      ? `/${mediaType}/${user._id}/watched/${media._id}`
      : `/${mediaType}/${user._id}/watched`;
    const data = isWatched ? {} : { showId: media._id };

    try {
      await axios({ method, url: `${BASE_URL}${url}`, data });
      setIsWatched(!isWatched); // Toggle watched state
    } catch (error) {
      console.error(`Error toggling media in watched list:`, error);
    }
  };

  // Update button text and styles based on the watched state
  const buttonStyles = isWatched
    ? "bg-contrastBlue hover:bg-blue font-bold"
    : "bg-blue hover:bg-contrastBlue font-bold";
  const actionText = isWatched ? removeFromWatchedText : addToWatchedText;

  return (
    <button
      className={`${buttonStyles} text-white py-3 px-5 flex items-center justify-start rounded-2xl transition-colors duration-150 ease-in-out w-full`}
      onClick={toggleWatchedStatus}
    >
      <div className="flex items-center">
        {actionText}
        <span className="ml-2 text-sm">
          {isWatched ? "Премахни от изгледани" : "Добави към изгледани"}
        </span>
      </div>
    </button>
  );
}

export default WatchedButton;
