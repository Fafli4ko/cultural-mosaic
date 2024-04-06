import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function WatchListButton({
  user,
  media,
  mediaType,
  addToWatchlistText,
  removeFromWatchlistText,
  isInWatchList,
}) {
  const [isWatchListed, setIsWatchListed] = useState(isInWatchList);

  useEffect(() => {
    setIsWatchListed(isInWatchList); // Ensure the state is updated if the prop changes externally
  }, [isInWatchList]);

  const toggleWatchListStatus = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }

    const method = isWatchListed ? "delete" : "put";
    const url = isWatchListed
      ? `/${mediaType}/${user._id}/toWatch/${media._id}`
      : `/${mediaType}/${user._id}/toWatch`;
    const data = isWatchListed ? {} : { showId: media._id };

    try {
      await axios({ method, url: `${BASE_URL}${url}`, data });
      setIsWatchListed(!isWatchListed); // Toggle the watchlist status
    } catch (error) {
      console.error(`Error toggling media in watch list:`, error);
    }
  };

  const buttonStyles = isWatchListed
    ? "bg-contrastBlue hover:bg-blue font-bold"
    : "bg-blue hover:bg-contrastBlue font-bold";
  const buttonText = isWatchListed
    ? removeFromWatchlistText
    : addToWatchlistText;
  const actionText = isWatchListed
    ? "Премахни от списък за по-късно"
    : "Добави в списък за по-късно";

  return (
    <button
      className={`${buttonStyles} text-white py-2 px-4 flex items-center justify-start rounded-2xl transition-colors duration-150 ease-in-out w-full`}
      onClick={toggleWatchListStatus}
    >
      <div className="flex items-center">
        {buttonText}
        <span className="ml-2 text-sm">{actionText}</span>
      </div>
    </button>
  );
}

export default WatchListButton;
