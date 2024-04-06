import React, { useState } from "react";
import axios from "axios";

function WatchListButton({
  user,
  media,
  mediaType,
  addToWatchlistText,
  removeFromWatchlistText,
  isInWatchList,
}) {
  // Initial state is based on whether the item is already in the watchlist
  const [isWatchListed, setIsWatchListed] = useState(isInWatchList);

  const handleAddToWatchlist = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }

    try {
      await axios.put(`/${mediaType}/${user._id}/toWatch`, {
        showId: media._id,
      });
      setIsWatchListed(true); // Successfully added to watchlist, update state
    } catch (error) {
      console.error("Error adding media to watch list:", error);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }

    try {
      await axios.delete(`/${mediaType}/${user._id}/toWatch/${media._id}`);
      setIsWatchListed(false); // Successfully removed from watchlist, update state
    } catch (error) {
      console.error("Error removing media from watch list:", error);
    }
  };

  // Text and styling update based on isWatchListed state
  const actionText = isWatchListed
    ? "Премахни от списък за по-късно"
    : "Добави в списък за по-късно";
  const buttonColor = isWatchListed
    ? "bg-contrastBlue hover:bg-blue font-bold"
    : "bg-blue hover:bg-contrastBlue font-bold";

  return (
    <button
      className={`${buttonColor} text-white py-2 px-4 flex items-center justify-start rounded-2xl transition-colors duration-150 ease-in-out w-full`}
      onClick={isWatchListed ? handleRemoveFromWatchlist : handleAddToWatchlist}
    >
      {isWatchListed ? removeFromWatchlistText : addToWatchlistText}
      <span className="ml-2 text-sm">{actionText}</span>
    </button>
  );
}

export default WatchListButton;
