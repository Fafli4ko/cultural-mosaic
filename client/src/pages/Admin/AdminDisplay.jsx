import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AddIcon } from "./../../Icons.jsx";
import Image from "../../Utilities/Image.jsx";

export default function AdminDisplay() {
  const { pathname } = useLocation();
  let subpage = pathname.split("/").pop() || "movies"; // Default to "movies" if subpage is undefined

  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/${subpage}/${subpage}`);
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [subpage]);

  return (
    <div>
      <div className="text-center mt-6">
        <Link
          to={`/admin/${subpage}/new`}
          className="bg-blue p-3 rounded-full inline-flex items-center justify-center gap-2 text-white hover:bg-contrastBlue transition duration-300 ease-in-out"
        >
          Добави{" "}
          {(subpage === "movies" && "филм") ||
            (subpage === "shows" && "сериал") ||
            (subpage === "books" && "книга")}
          <AddIcon />
        </Link>
      </div>
      <div className="mt-8 px-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {content.length > 0 &&
          content.map((item) => (
            <Link
              to={`/admin/${subpage}/${item._id}`}
              key={item._id}
              className="flex flex-col cursor-pointer gap-4 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-contrastBg"
            >
              <div className="w-full h-0 pb-[150%] relative overflow-hidden rounded-lg">
                {item.photos.length > 0 && (
                  <Image
                    className="absolute top-0 left-0 object-cover w-full h-full"
                    src={item.photos[0]}
                    alt={item.title}
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">{item.title}</h2>
                <p className="text-md mt-1 text-contrast">
                  {subpage === "books" ? item.author : item.director}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
