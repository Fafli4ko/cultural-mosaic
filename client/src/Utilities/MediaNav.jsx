import { Link, useLocation } from "react-router-dom";

export default function MediaNav() {
  const { pathname } = useLocation();
  let page = pathname.split("/")?.[1];
  if (page === undefined || page === "") {
    page = "movies";
  }
  let subpage = pathname.split("/")?.[2];

  function linkClasses(type = null) {
    let classes =
      "p-2 px-6 text-mWhite opacity-90 hover:opacity-100 hover:text-m";
    if (type === page) {
      classes +=
        " bg-selectOrange rounded-full text-white font-semibold opacity-100";
    }
    return classes;
  }

  return (
    <div className="w-auto flex justify-center ">
      <nav className=" w-auto flex mt-5 gap-2 bg-orange p-2 rounded-2xl">
        <Link className={linkClasses("movies")} to={"/"}>
          Филми
        </Link>
        <Link className={linkClasses("shows")} to={"/shows"}>
          Сериали
        </Link>
        <Link className={linkClasses("books")} to={"/books"}>
          Книги
        </Link>
      </nav>
    </div>
  );
}
