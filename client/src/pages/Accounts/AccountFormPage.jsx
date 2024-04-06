import React, { useState, useEffect, useContext } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";

export default function AccountFormPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user: currentUser } = useContext(UserContext);

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Added state for admin switch
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
        setIsAdmin(data.admin || false); // Set the admin state based on fetched data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id, currentUser]);

  const validateField = (name, value) => {
    let errorMsg = "";
    if (
      !value.trim() &&
      name !== "newPassword" &&
      name !== "confirmNewPassword"
    )
      errorMsg = "This field is required.";
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value))
      errorMsg = "Please enter a valid email address.";
    if (name === "newPassword" && value.length > 0 && value.length < 8)
      errorMsg = "New password must be at least 8 characters.";
    if (
      name === "confirmNewPassword" &&
      newPassword.length > 0 &&
      value !== newPassword
    )
      errorMsg = "Passwords do not match.";
    return errorMsg;
  };

  const isFormValid = () => {
    const newErrors = {};
    newErrors.user = validateField("user", user);
    newErrors.email = validateField("email", email);
    if (currentUser._id === id) {
      if (newPassword) {
        newErrors.newPassword = validateField("newPassword", newPassword);
        newErrors.confirmNewPassword = validateField(
          "confirmNewPassword",
          confirmNewPassword
        );
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => !newErrors[key]);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isFormValid()) {
      alert("Моля попълнете всички полета правилно.");
      return;
    }

    const userData = {
      user,
      email,
      ...(currentUser._id === id &&
        oldPassword &&
        newPassword && { oldPassword, newPassword }),
      ...(currentUser.admin && { admin: isAdmin }), // Update the user's admin status if the current user is an admin
    };

    try {
      await axios.put(`/auth/users/${id}`, userData);
      setRedirect(true);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Сигурни ли сте че искате да изтриете този акаунт?")) {
      try {
        await axios.delete(`/auth/users/${id}`, { withCredentials: true });
        navigate("/");
      } catch (error) {
        console.error("Error deleting user account:", error);
        alert("Имаше грешка, моля опитайте отново или се свържете с нас.");
      }
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className={`bg-background p-5 flex justify-center items-center ${
        currentUser._id !== id
          ? "min-h-96 mt-5 mb-8 pb-72"
          : "min-h-screen -mt-20"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-contrastBg rounded-lg shadow-md p-8"
      >
        <h1 className="text-2xl font-semibold mb-6 text-primary">
          Редактиране на акаунт
        </h1>

        {/* User input */}
        <div className="mb-5">
          <label htmlFor="user" className="block text-primary font-bold mb-2">
            Потребителско име
          </label>
          <input
            id="user"
            type="text"
            placeholder="Потребителско име"
            value={user}
            onChange={(ev) => {
              setUser(ev.target.value);
              validateField("user", ev.target.value);
            }}
            className={`w-full p-3 border ${
              errors.user ? "border-orange" : "border-mContrastWhite"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.user && (
            <p className="text-orange text-xs italic">{errors.user}</p>
          )}
        </div>

        {/* Email input */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-primary font-bold mb-2">
            Имейл
          </label>
          <input
            id="email"
            type="email"
            placeholder="Имейл"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
              validateField("email", ev.target.value);
            }}
            className={`w-full p-3 border ${
              errors.email ? "border-orange" : "border-mContrastWhite"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.email && (
            <p className="text-orange text-xs italic">{errors.email}</p>
          )}
        </div>

        {/* Password inputs, conditional rendering based on whether the currentUser is editing their own account */}
        {currentUser._id === id && (
          <>
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
                onChange={(ev) => setOldPassword(ev.target.value)}
                className="w-full p-3 border border-mContrastWhite rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
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
                onChange={(ev) => {
                  setNewPassword(ev.target.value);
                  validateField("newPassword", ev.target.value);
                }}
                className={`w-full p-3 border ${
                  errors.newPassword ? "border-orange" : "border-mContrastWhite"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.newPassword && (
                <p className="text-orange text-xs italic">
                  {errors.newPassword}
                </p>
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
                onChange={(ev) => {
                  setConfirmNewPassword(ev.target.value);
                  validateField("confirmNewPassword", ev.target.value);
                }}
                className={`w-full p-3 border ${
                  errors.confirmNewPassword
                    ? "border-orange"
                    : "border-mContrastWhite"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.confirmNewPassword && (
                <p className="text-orange text-xs italic">
                  {errors.confirmNewPassword}
                </p>
              )}
            </div>
          </>
        )}

        {/* Admin switch */}
        {currentUser.admin && (
          <div className="mb-5 flex items-center">
            <label
              htmlFor="isAdmin"
              className="block text-primary font-bold mr-2"
            >
              Администратор:
            </label>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="form-checkbox h-6 w-6 text-primary rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="bg-primary hover:bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
          >
            Запази
          </button>
          <Link
            to="/admin"
            className="inline-block bg-transparent hover:bg-blue text-primary font-semibold hover:text-white py-2 px-4 border border-primary hover:border-transparent rounded focus:outline-none focus:shadow-outline w-full sm:w-auto text-center"
          >
            Отказ
          </Link>
          {(currentUser._id === id || currentUser.admin) && (
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
            >
              Изтрий акаунт
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
