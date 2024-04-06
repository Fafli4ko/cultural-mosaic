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

export default function BookPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRating, setuserRating] = useState(0);

  useEffect(() => {
    if (!id || !user?._id) {
      return;
    }

    const fetchBookData = async () => {
      try {
        const response = await axios.get(`/books/books/${id}`);
        const fetchedBook = response.data;

        setBook(fetchedBook);
        if (fetchedBook && fetchedBook.hasBeenRatedBy.includes(user._id)) {
          setIsRated(true);
          setAverageRating(fetchedBook.averageRating);
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [id, user?._id]);

  useEffect(() => {
    if (isRated && book && user) {
      const userIndex = book.hasBeenRatedBy.findIndex((id) => id === user._id);
      const rating = userIndex !== -1 ? book.rating[userIndex] : 0; // Corrected to `book.ratings`
      setuserRating(rating);
    }
  }, [isRated, book, user]);

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
      const response = await axios.post(`/books/api/books/${id}/rate`, {
        rating,
        userId: user._id,
      });
      const updatedBook = response.data;
      setBook(updatedBook);
      setIsRated(true);
      setAverageRating(updatedBook.averageRating);
    } catch (error) {
      setErrorMessage("Неуспешно оценяване на филма. Моля, опитайте по-късно.");
      console.error("Error rating the book:", error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  const isInWatchlist = user.toReadBooks.includes(book._id);
  const isInWatched = user.readBooks.includes(book._id);

  return (
    <div
      className="min-h-fit pb-16 bg-[#F8FAFC] text-gray-900"
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full lg:w-1/4 px-3 mb-6 lg:mb-0">
            {book.photos?.[0] && (
              <Image
                className="rounded-xl object-cover w-full h-auto shadow-lg"
                src={book.photos[0]}
                alt={book.title}
              />
            )}
          </div>
          <div className="w-full lg:w-1/2 px-3 transition-shadow duration-300">
            <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-4xl text-teal-600 font-bold mb-4 hover:text-teal-700 transition-colors duration-300">
                {book.title}
              </h2>
              <div className="text-gray-700 mb-4 space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Година:</span>{" "}
                  {book.releaseYear}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Автор:</span> {book.author}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Описание:</span>{" "}
                  {book.description}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Жанр:</span>{" "}
                  {book.genre.join(", ")}
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-semibold">Страници:</span> {book.pages}{" "}
                  минути
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
                  media={book}
                  mediaType="books"
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
                  media={book}
                  mediaType="books"
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
                        {book.hasBeenRatedBy.length}
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