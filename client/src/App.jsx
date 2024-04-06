import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/Accounts/LoginPage.jsx";
import Layout from "./Layout";
import RegisterPage from "./pages/Accounts/RegisterPage.jsx";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import MoviePage from "./pages/Movies/MoviePage.jsx";
import ShowPage from "./pages/Shows/ShowPage.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import AdminForm from "./pages/Admin/AdminForm.jsx";
import AccountFormPage from "./pages/Accounts/AccountFormPage.jsx";
import WatchedPage from "./pages/User/WatchedPage.jsx";
import ToWatchPage from "./pages/User/ToWatchPage.jsx";
import BookPage from "./pages/Books/BookPage.jsx";
import AboutUs from "./pages/AboutUs.jsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/shows" element={<IndexPage />} />
          <Route path="/books" element={<IndexPage />} />

          <Route path="/movies/search/:name" element={<IndexPage />} />
          <Route path="/shows/search/:name" element={<IndexPage />} />
          <Route path="/books/search/:name" element={<IndexPage />} />
          <Route path="/:subpage/search/:name" element={<IndexPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:subpage" element={<AdminPage />} />
          <Route path="/admin/:subpage/:id" element={<AdminForm />} />
          <Route path="/admin/toWatch/:id" element={<IndexPage />} />
          <Route path="/admin/watched/:id" element={<IndexPage />} />

          <Route path="/user/:id" element={<AccountFormPage />} />

          <Route path="/movies/toWatch/:id" element={<ToWatchPage />} />
          <Route path="/shows/toWatch/:id" element={<ToWatchPage />} />
          <Route path="/books/toWatch/:id" element={<ToWatchPage />} />

          <Route path="/movies/watched/:id" element={<WatchedPage />} />
          <Route path="/shows/watched/:id" element={<WatchedPage />} />
          <Route path="/books/watched/:id" element={<WatchedPage />} />

          <Route path="/movies/:id" element={<MoviePage />} />

          <Route path="/shows/:id" element={<ShowPage />} />

          <Route path="/books/:id" element={<BookPage />} />

          <Route path="/info" element={<AboutUs />} />
          <Route path="*" element={<IndexPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
