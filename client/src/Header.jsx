import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import {
  LogoIcon,
  AdminIcon,
  SavedIcon,
  BookIcon,
  MovieIcon,
  ShowIcon,
  SearchIcon,
  ProfileIcon,
} from "./Icons";
import DropdownMenu from "./Utilities/Dropdown";
import { transliterate as tr } from "transliteration";

export default function Header() {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  let page = pathname.split("/")?.[1] || "movies";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/${page}/search/${tr(searchTerm)}`);
    }
  };

  const renderLinkForPage = () => {
    const pageTypes = {
      shows: { label: "Гледани сериали", icon: <ShowIcon /> },
      books: { label: "Прочетени книги", icon: <BookIcon /> },
      default: { label: "Гледани филми", icon: <MovieIcon /> },
    };

    const { label, icon } = pageTypes[page] || pageTypes.default;
    const linkTo = user ? `/${page}/watched/${user._id}` : "/login";
    return (
      <Link to={linkTo} className="flex items-center gap-2">
        <span className="text-white font-bold">{label}</span>
        {icon}
      </Link>
    );
  };

  return (
    <header className="flex display-flex justify-between items-center bg-gradient-to-r from-orange to-selectOrange p-4 rounded-t-xl sticky z-20 top-0">
      <Link to={"/"} className="flex items-center gap-2">
        <LogoIcon />
      </Link>
      <div className="py-4 px-12 mr-2 rounded-2xl bg-blue hover:bg-contrastBlue flex items-center gap-4">
        {renderLinkForPage()}
      </div>
      <form
        onSubmit={handleSubmit}
        className="pl-2 w-96 -ml-8 pr-2 flex gap-4 px-2 py-2 rounded-2xl bg-white/30 bg-mGray"
      >
        <input
          type="text"
          placeholder="Търси..."
          className="outline-none bg-background flex-1 shadow-selectOrange shadow-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </form>
      <div>
        {user ? (
          <Link
            to={`/${page}/ToWatch/${user._id}`}
            className="px-4 py-2 bg-blue rounded-2xl flex items-center gap-2 hover:bg-contrastBlue"
          >
            <SavedIcon />
            <span className="text-white font-bold">Запазени за по-късно</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue rounded-2xl flex items-center gap-2 hover:bg-contrastBlue"
          >
            <SavedIcon />
            <span className="text-white font-bold">Запазени за по-късно</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!!user && user.admin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 absolute right-24 "
          >
            <AdminIcon />
          </Link>
        )}
        {user ? (
          <DropdownMenu className="flex items-stretch gap-2 mr-2 border-white border-2 p-1 bg-mWhite hover:bg-mContrastWhite hover:border-mContrastWhite rounded-2xl" />
        ) : (
          <Link
            to="/login"
            className="flex items-stretch gap-2 mr-2 border-white border-2 p-1.5 bg-mWhite hover:bg-mContrastWhite hover:border-mContrastWhite rounded-2xl"
          >
            <ProfileIcon />
          </Link>
        )}
      </div>
    </header>
  );
}
