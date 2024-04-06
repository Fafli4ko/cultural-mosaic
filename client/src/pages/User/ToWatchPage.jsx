import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import WatchNav from "../../Utilities/WatchNav";
import { motion } from "framer-motion";
import Image from "../../Utilities/Image";

export default function ToWatchPage() {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();
  let subpage = pathname.split("/")[1];
  const userID = pathname.split("/")[3];

  const [currentMedia, setCurrentMedia] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (user && userID) {
          const response = await axios.get(
            `/${subpage}/${subpage}/toWatch/${userID}`
          );
          setCurrentMedia(response.data); // Data is not randomized here
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname, userID, subpage, user]);

  if (isLoading) {
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

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
        minHeight: "100vh",
      }}
      className="w-full rounded-b-2xl"
    >
      <WatchNav className="p-1 flex justify-between" watchType="toWatch" />
      <motion.div
        className="flex justify-center items-start pt-4 ml-6 mr-6"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
              onMouseEnter={() => setHoveredId(media._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                to={`/${subpage}/${media._id}`}
                className="w-full h-full flex flex-col"
              >
                {media.photos?.[0] && (
                  <Image
                    className="object-cover w-full"
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
                  <p className="truncate mt-1">{media.rating}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
