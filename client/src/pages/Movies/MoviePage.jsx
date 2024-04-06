import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import WatchlistButton from "../../Utilities/WatchListButton";
import WatchedButton from "../../Utilities/WatchedButton";
import {
  RemoveWatchLaterIcon,
  UnwatchIcon,
  WatchIcon,
  WatchLaterIcon,
} from "../../Icons";
import Image from "../../Utilities/Image";
import { motion } from "framer-motion";

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRating, setuserRating] = useState(0);

  useEffect(() => {
    if (!id || !user?._id) {
      return;
    }

    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`/movies/movies/${id}`);
        const fetchedMovie = response.data;

        setMovie(fetchedMovie);
        if (fetchedMovie && fetchedMovie.hasBeenRatedBy.includes(user._id)) {
          setIsRated(true);
          setAverageRating(fetchedMovie.averageRating);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id, user?._id]);

  useEffect(() => {
    if (isRated && movie && user) {
      const userIndex = movie.hasBeenRatedBy.findIndex((id) => id === user._id);
      const rating = userIndex !== -1 ? movie.ratings[userIndex] : 0;
      setuserRating(rating);
    }
  }, [isRated, movie, user]);

  const handleRatingChange = (change) => {
    setRating((prevRating) => {
      let newRating = prevRating + change;
      newRating = Math.max(0, Math.min(newRating, 5)); // Ensure rating is between 0 and 5
      return newRating;
    });
  };

  const handleRatingSubmit = async () => {
    if (isRated || rating < 0 || rating > 5) {
      return;
    }

    try {
      const response = await axios.post(`/movies/api/movies/${id}/rate`, {
        rating,
        userId: user._id,
      });
      const updatedMovie = response.data;
      setMovie(updatedMovie);
      setIsRated(true);
      setAverageRating(updatedMovie.averageRating);
    } catch (error) {
      setErrorMessage("Неуспешно оценяване на филма. Моля, опитайте по-късно.");
      console.error("Error rating the movie:", error);
    }
  };

  if (!movie) {
    return (
      <div
        className="flex justify-center items-center"
        style={{
          background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
          minHeight: "80vh",
        }}
      >
        <div className="inline-block p-6 bg-orange rounded-lg shadow-lg">
          <div className="text-center p-4 bg-lightOrange rounded-lg">
            <div className="text-3xl font-bold text-mWhite">Зареждане...</div>
          </div>
        </div>
      </div>
    );
  }

  const isInWatchlist = user.toWatchMovies.includes(movie._id);
  const isInWatched = user.watchedMovies.includes(movie._id);

  return (
    <div
      className="pb-2 bg-[#F8FAFC] text-gray-900"
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
        minHeight: "80vh",
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full lg:w-1/4 px-3 mb-6 lg:mb-0">
            {movie.photos?.[0] && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Image
                  className="rounded-xl object-cover w-full h-auto shadow-lg"
                  src={movie.photos[0]}
                  alt={movie.title}
                />
              </motion.div>
            )}
          </div>
          <div className="w-full lg:w-1/2 px-3 transition-shadow duration-300">
            <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-4xl text-teal-600 font-bold mb-4 hover:text-teal-700 transition-colors duration-300">
                {movie.title}
              </h2>
              <div className="text-gray-700 mb-4 space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Година:</span>{" "}
                  {movie.releaseYear}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Режисьор:</span>{" "}
                  {movie.director}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Описание:</span>{" "}
                  {movie.description}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Жанр:</span>{" "}
                  {movie.genre.join(", ")}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Времетраене:</span>{" "}
                  {movie.runTime} минути
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4 px-3">
            <div className="bg-gradient-to-br from-lightOrange to-orange p-6 rounded-lg shadow-lg text-white">
              <div className="text-lg font-bold text-white mb-4">
                Вашите действия:
              </div>
              <div className="flex items-center mb-4">
                <WatchlistButton
                  user={user}
                  media={movie}
                  mediaType="movies"
                  addToWatchlistText={
                    <WatchLaterIcon className="h-5 w-5 mr-2 text-white" />
                  }
                  removeFromWatchlistText={
                    <RemoveWatchLaterIcon className="h-5 w-5 mr-2 text-white" />
                  }
                  isInWatchList={isInWatchlist}
                />
              </div>
              <div>
                <WatchedButton
                  user={user}
                  media={movie}
                  mediaType="movies"
                  addToWatchedText={
                    <WatchIcon className="h-5 w-5 mr-2 text-white" />
                  }
                  removeFromWatchedText={
                    <UnwatchIcon className="h-5 w-5 mr-2 text-white" />
                  }
                  isInWatched={isInWatched}
                />
              </div>
              {isRated ? (
                <>
                  <div className="mt-5">
                    <div className="flex">
                      <div className="text-lg font-bold text-white">
                        Вашата оценка:
                      </div>
                      <div className="text-white text-xl mb-2 ml-2 font-bold">
                        {userRating}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="text-lg font-bold text-white">
                        Средна оценка:
                      </div>
                      <div className="text-white text-xl mb-2 ml-2 font-bold">
                        {averageRating.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="text-lg font-bold text-white">
                        Брой оценки:
                      </div>
                      <div className="text-white text-xl ml-2 font-bold">
                        {movie.hasBeenRatedBy.length}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-white mt-4">
                    Оценете този филм:
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleRatingChange(0.5)}
                      className="rounded-tl-full rounded-bl-full bg-green-500 hover:bg-green-600 text-white p-2"
                    >
                      ↑
                    </button>
                    <div className="px-4 py-2 text-white">{rating}</div>
                    <button
                      onClick={() => handleRatingChange(-0.5)}
                      className="rounded-tr-full rounded-br-full bg-red-500 hover:bg-red-600 text-white p-2"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={handleRatingSubmit}
                    className="bg-[#45ABB8] hover:bg-[#3C95A0] text-white rounded-md px-4 py-2 w-full mt-2"
                  >
                    Подайте оценка
                  </button>
                </>
              )}
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
