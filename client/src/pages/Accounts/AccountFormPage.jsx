import React, { useState, useEffect, useContext } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";

export default function AccountFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser || (currentUser._id !== id && !currentUser.admin)) {
      setRedirect(true);
      return;
    }

    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`/auth/users/${id}`);
        setUser(data.user);
        setEmail(data.email);
        setIsAdmin(data.admin || false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, currentUser]);

  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) errorMsg = "This field is required.";
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value))
      errorMsg = "Моля въведете реален имейл адрес.";
    if (name === "newPassword" && value && value.length < 8)
      errorMsg = "Паролата трябва да е поне 8 символа.";
    if (name === "confirmNewPassword" && value !== newPassword)
      errorMsg = "Паролите не съвпадат.";

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    return errorMsg;
  };

  const isFormValid = () => {
    const fieldsToValidate = {
      user,
      email,
      ...(newPassword && { newPassword, confirmNewPassword }),
    };
    const newErrors = Object.keys(fieldsToValidate).reduce((acc, key) => {
      const error = validateField(key, fieldsToValidate[key]);
      if (error) acc[key] = error;
      return acc;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isFormValid()) return;

    let userData = {
      user,
      email,
      newPassword,
      ...(currentUser.admin && currentUser._id !== id ? {} : { oldPassword }),
      admin: isAdmin,
    };

    try {
      await axios.put(`/auth/users/${id}`, userData);
      navigate("/");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Сигурни ли сте че искате да изтриете този акаунт?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`/auth/users/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting user account:", error);
      alert("Имаше грешка, моля опитайте отново.");
    }
  };

  if (redirect) {
    return <Navigate to="/admin" />;
  }

  return (
    <div
      className="bg-background p-5 flex justify-center items-center min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #E0E0E0)",
        minHeight: "80vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-contrastBg rounded-lg shadow-md p-8"
      >
        <h1 className="text-2xl font-semibold mb-3 text-primary">
          Редактиране на акаунт
        </h1>

        <div className="mb-5">
          <label htmlFor="user" className="block text-primary font-bold mb-2">
            Потребителско име
          </label>
          <input
            id="user"
            type="text"
            placeholder="Потребителско име"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
          />
          {errors.user && (
            <p className="text-red-500 text-xs italic">{errors.user}</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-primary font-bold mb-2">
            Имейл
          </label>
          <input
            id="email"
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        {(!currentUser.admin || currentUser._id === id) && (
          <div className="mb-5">
            <label
              htmlFor="oldPassword"
              className="block text-primary font-bold mb-2"
            >
              Стара парола
            </label>
            <input
              id="oldPassword"
              type="password"
              placeholder="Стара парола"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none"
            />
            {/* Show error for oldPassword if any */}
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="newPassword"
            className="block text-primary font-bold mb-2"
          >
            Нова парола
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Нова парола"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs italic">{errors.newPassword}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="confirmNewPassword"
            className="block text-primary font-bold mb-2"
          >
            Потвърди нова парола
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            placeholder="Потвърди нова парола"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-xs italic">
              {errors.confirmNewPassword}
            </p>
          )}
        </div>

        {currentUser.admin && (
          <div className="mb-5 flex items-center">
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="form-checkbox h-5 w-5 text-primary rounded mr-2"
            />
            <label htmlFor="isAdmin" className="text-primary font-bold">
              Администратор
            </label>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Запази
          </button>
          <Link
            to="/admin"
            className="inline-block bg-transparent hover:bg-blue text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-transparent rounded focus:outline-none focus:shadow-outline w-full sm:w-auto text-center"
          >
            Отказ
          </Link>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Изтрий акаунт
          </button>
        </div>
      </form>
    </div>
  );
}
