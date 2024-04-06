import React, { useState } from "react";
import axios from "axios";

function WatchedButton({
  user,
  media,
  mediaType,
  addToWatchedText,
  removeFromWatchedText,
  isInWatched,
}) {
  // Use the state to track if the item is watched
  const [isWatched, setIsWatched] = useState(isInWatched);

  const handleAddToWatched = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }
    try {
      await axios.put(`/${mediaType}/${user._id}/watched`, {
        showId: media._id,
      });
      setIsWatched(true); // Update state to reflect the change
    } catch (error) {
      console.error("Error adding media to watched list:", error);
    }
  };

  const handleRemoveFromWatched = async () => {
    if (!media._id || !user._id) {
      console.error("Invalid media ID or user ID");
      return;
    }
    try {
      await axios.delete(`/${mediaType}/${user._id}/watched/${media._id}`);
      setIsWatched(false); // Update state to reflect the change
    } catch (error) {
      console.error("Error removing media from watched list:", error);
    }
  };

  // Dynamically set button text and styles based on watched state
  const actionText = isWatched
    ? "Премахни от изгледани"
    : "Добави към изгледани";
  const buttonStyles = isWatched
    ? "bg-contrastBlue hover:bg-blue font-bold"
    : "bg-blue hover:bg-contrastBlue font-bold";

  return (
    <button
      className={`${buttonStyles} text-white py-3 px-5 flex items-center justify-start rounded-2xl transition-colors duration-150 ease-in-out w-full`}
      onClick={isWatched ? handleRemoveFromWatched : handleAddToWatched}
    >
      <div className="flex items-center">
        {isWatched ? removeFromWatchedText : addToWatchedText}
        <span className="ml-2 text-sm">{actionText}</span>
      </div>
    </button>
  );
}

export default WatchedButton;
