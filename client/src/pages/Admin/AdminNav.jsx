import { Link, useLocation } from "react-router-dom";

export default function AdminNav() {
  const { pathname } = useLocation();
  let page = pathname.split("/")?.[1];
  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined || subpage === "") {
    subpage = "profiles";
  }

  function linkClasses(type = null) {
    let classes =
      "p-2 px-6 text-mWhite opacity-90 hover:opacity-100 hover:text-m";
    if (type === subpage) {
      classes +=
        " bg-selectOrange rounded-full text-white font-semibold opacity-100";
    }
    return classes;
  }

  return (
    <div className="w-auto flex justify-center">
      <nav className="w-auto flex mt-4 gap-2 bg-orange p-2 rounded-2xl mb-1">
        <Link className={linkClasses("profiles")} to={"/admin"}>
          Профили
        </Link>
        <Link className={linkClasses("movies")} to={"/admin/movies"}>
          Филми
        </Link>
        <Link className={linkClasses("shows")} to={"/admin/shows"}>
          Сериали
        </Link>
        <Link className={linkClasses("books")} to={"/admin/books"}>
          Книги
        </Link>
      </nav>
    </div>
  );
}
