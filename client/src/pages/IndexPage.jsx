import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import MediaNav from "../Utilities/MediaNav";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";
import Image from "../Utilities/Image";

export default function IndexPage() {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();
  let subpage = pathname.split("/")[1] || "movies";
  let searchTerm = pathname.split("/")[3] || "";

  const [currentMedia, setCurrentMedia] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const endpoint =
          searchTerm === ""
            ? `/${subpage}/${subpage}`
            : `/${subpage}/search/${searchTerm}`;
        const response = await axios.get(endpoint);
        const randomizedData = response.data.sort(() => Math.random() - 0.5);
        setCurrentMedia(randomizedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [subpage, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-4xl font-bold">Зареждане...</div>
      </div>
    );
  }

  if (currentMedia.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800 mb-4">
            Няма намерени {subpage === "movies" ? "филми" : "медии"}
          </p>
          <p className="text-xl text-gray-600">
            Опитайте да промените критериите за търсене.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
        minHeight: "100vh",
      }}
      className="w-full rounded-b-2xl"
    >
      <MediaNav className="p-1 justify-between" />
      <motion.div
        className="flex justify-center items-start pt-4 ml-12 mr-12 mt-7"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.5,
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 space-x-2">
          {currentMedia.map((media) => (
            <motion.div
              key={media._id}
              className="inline-block relative bg-white rounded-2xl shadow-lg overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    opacity: { duration: 1 },
                    y: { type: "spring", stiffness: 100 },
                  },
                },
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Link
                to={user ? `/${subpage}/${media._id}` : `/login`}
                className="w-full h-full flex flex-col"
                onMouseEnter={() => setHoveredId(media._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {media.photos?.[0] && (
                  <Image
                    className="object-cover w-full h-full"
                    src={media.photos[0]}
                    alt={media.title}
                  />
                )}
                <div
                  className={`absolute inset-0 transition-opacity duration-400 ${
                    hoveredId === media._id
                      ? "bg-black opacity-75"
                      : "opacity-0"
                  } flex flex-col justify-center items-center text-white`}
                >
                  <h2 className="text-2xl font-bold">{media.title}</h2>
                  <p className="truncate mt-1">
                    {media.averageRating.toFixed(1)} / 5
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
