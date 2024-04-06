import { useContext, useState, useEffect } from "react";
import { UserContext } from "./../../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminNav from "./AdminNav.jsx";
import AdminDisplay from "./AdminDisplay.jsx";

export default function AdminPage() {
  const [redirect, setRedirect] = useState(null);
  const {
    ready,
    user: userCurrent,
    setUser: setUserCurrent,
  } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("/auth/admin-users").then(({ data }) => {
      setUsers(data);
    });
  }, []);

  if (userCurrent && userCurrent.admin === false) {
    return <Navigate to={"/"} />;
  }

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/auth/logout");
    setRedirect("/");
    setUserCurrent(null);
  }

  if (!ready) {
    return <div style={{ color: "#51829B" }}>Зареждане...</div>;
  }

  if (ready && !userCurrent && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div
      className="bg-background "
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
        minHeight: "80vh",
      }}
    >
      <div
        className="container mx-auto bg-background rounded-2xl mt-5 px-5"
        style={{
          background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
          minHeight: "80vh",
        }}
      >
        <AdminNav />
        {subpage === "profile" && (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {users.length > 0 &&
              users.map((user) => (
                <Link
                  to={`/user/${user._id}`}
                  key={user._id}
                  className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  <div className="p-4 pr-6 border rounded-lg shadow-md bg-contrastBlue bg-opacity-80 hover:bg-opacity-100 hover:bg-blue text-mWhite shadow-lg min-h-64">
                    <p className="text-md font-medium ">
                      {user.admin ? "Администратор" : "Потребител"}
                    </p>
                    <h2 className="text-xl text-opacity-100 font-bold mt-1">
                      Име: {user.user}
                    </h2>
                    <p className="text-md mt-2 ">
                      Имейл:
                      <br />
                      {user.email}
                    </p>
                    <div className="mt-2 text-md">
                      <p>Гледани филми: {user.watchedMovies.length}</p>
                      <p>Гледани сериали: {user.watchedShows.length}</p>
                      <p>Прочетени книги: {user.readBooks.length}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
        {subpage === "movies" && <AdminDisplay />}
        {subpage === "shows" && <AdminDisplay />}
        {subpage === "books" && <AdminDisplay />}
      </div>
    </div>
  );
}
