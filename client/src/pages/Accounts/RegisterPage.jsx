import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i
    );
  };

  const validateForm = () => {
    if (!user || !email || !password) {
      setError("Всички полета са задължителни.");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Моля, въведете валиден имейл адрес.");
      return false;
    }

    if (password.length < 8) {
      setError("Паролата трябва да бъде поне 8 символа.");
      return false;
    }

    return true;
  };

  async function registerUser(ev) {
    ev.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("/auth/register", {
        user,
        email,
        password,
      });
      alert("Успешно регистриране!");
    } catch (error) {
      console.error("Регистрацията не бе успешна:", error);
      setError("Неуспешно регистриране. Моля, опитайте отново.");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-center bg-[#F3F5F2]">
      <div className="p-8 mb-32 bg-[#ECEDEA] rounded-lg shadow-lg">
        <h1 className="text-4xl text-[#3C95A0] text-center mb-6">
          Регистрация
        </h1>
        <form
          action=""
          className="max-w-md mx-auto space-y-4"
          onSubmit={registerUser}
        >
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <input
            className="w-full p-3 rounded border border-[#9BB0C1] placeholder-[#9BB0C1] focus:outline-none focus:ring-2 focus:ring-[#F29C1F]"
            type="text"
            placeholder="Име"
            value={user}
            onChange={(ev) => setUser(ev.target.value)}
          />
          <input
            className="w-full p-3 rounded border border-[#9BB0C1] placeholder-[#9BB0C1] focus:outline-none focus:ring-2 focus:ring-[#F29C1F]"
            type="email"
            placeholder="email@primer.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            className="w-full p-3 rounded border border-[#9BB0C1] placeholder-[#9BB0C1] focus:outline-none focus:ring-2 focus:ring-[#F29C1F]"
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button
            className="w-full p-3 bg-[#45ABB8] text-white rounded hover:bg-[#3C95A0] focus:outline-none focus:ring-2 focus:ring-[#F18F01] transition-colors"
            type="submit"
          >
            Регистрирай се
          </button>
          <div className="text-center py-2 text-[#9BB0C1]">
            Вече имате профил?{" "}
            <Link className="underline text-[#F29C1F]" to={"/login"}>
              Влезте.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
