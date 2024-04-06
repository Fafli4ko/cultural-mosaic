import { Link, useLocation } from "react-router-dom";

function Nav({ watchType }) {
  const { pathname } = useLocation();
  let media = pathname.split("/")?.[1];
  if (media === undefined || media === "") {
    media = "movies";
  }
  let userID = pathname.split("/")?.[3];

  function linkClasses(type = null) {
    let classes =
      "p-2 px-6 text-mWhite opacity-90 hover:opacity-100 hover:text-m"; // Adjusted classes for hover and text color
    if (type === media) {
      classes +=
        " bg-selectOrange rounded-full text-white font-semibold opacity-100"; // Adjusted classes for selected item
    }
    return classes;
  }

  return (
    <div>
      <div className="w-auto flex justify-center ">
        <nav className="w-auto mt-8 flex gap-2 bg-orange p-2 rounded-2xl">
          <Link
            className={linkClasses("movies")}
            to={`/movies/${watchType}/${userID}`}
          >
            Филми
          </Link>
          <Link
            className={linkClasses("shows")}
            to={`/shows/${watchType}/${userID}`}
          >
            Сериали
          </Link>
          <Link
            className={linkClasses("books")}
            to={`/books/${watchType}/${userID}`}
          >
            Книги
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default function ToWatchNav({ watchType = "watched" }) {
  return <Nav watchType={watchType} />;
}
