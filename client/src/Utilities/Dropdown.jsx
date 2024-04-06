import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import {
  MenuIcon,
  ProfileSettingsIcon,
  ProfileIcon,
  InfoIcon,
  LogOutIcon,
} from "./../Icons";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./../UserContext";

const DropdownMenu = () => {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const [redirect, setRedirect] = useState(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleItemClick = (item) => {
    console.log(`Selected item: ${item}`);
    setIsOpen(false);
  };

  async function logout() {
    await axios.post("/auth/logout");
    setRedirect("/");
    setUser(null);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div
      className="relative inline-block text-d h-16 w-16 mr-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          type="button"
          id="options-menu"
          className="flex justify-content border-white mt-3 mr-10 border-2 bg-mWhite hover:bg-mContrastWhite hover:border-mContrastWhite rounded-2xl"
        >
          <MenuIcon />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-auto rounded-2xl shadow-lg bg-gray-100 ring-1 p-2 ring-black ring-opacity-5 min-w-48"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-1 m-2" role="none">
            <div>
              <b>Име:</b> <br />
              {user.user}
            </div>
            <div>
              <b>Имейл:</b> <br />
              {user.email}
            </div>
            <div className="grid grid-cols-3 space-x-3 auto-rows-min">
              <button
                className="bg-red-500 py-4 max-w-sm mt-2 ml-2 rounded-2xl hover:bg-red-600"
                onClick={logout}
              >
                <LogOutIcon />
              </button>
              <button className="bg-orange rounded-2xl max-w-sm mt-2 ml-2 hover:bg-selectOrange place-items-center">
                <Link to={`/user/${user._id}`}>
                  <ProfileSettingsIcon />
                </Link>
              </button>
              <button className="bg-blue rounded-2xl max-w-sm mt-2 ml-2 hover:bg-contrastBlue ">
                <Link to={`/info`}>
                  <InfoIcon />
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
