import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  async function loginUser(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      setUser(data);
      alert("Успешно влязохте в системата");
      setRedirect(true);
    } catch (e) {
      alert("Невалиден имейл или парола");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-center bg-[#F3F5F2]">
      <div className="p-8 mb-32 bg-[#ECEDEA] rounded-lg shadow-lg">
        <h1 className="text-4xl text-[#3C95A0] text-center mb-6">
          Влез в акаунта си
        </h1>
        <form
          action=""
          className="max-w-md mx-auto space-y-4"
          onSubmit={loginUser}
        >
          <input
            className="w-full p-3 rounded border border-[#9BB0C1] placeholder-[#9BB0C1] focus:outline-none focus:ring-2 focus:ring-[#F29C1F]"
            type="email"
            placeholder="емайл@пример.com"
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
            Влез
          </button>
          <div className="text-center py-2 text-[#9BB0C1] flex justify-center items-center">
            Нямате акаунт?{" "}
            <Link className="underline ml-2 text-[#F29C1F]" to={"/register"}>
              Регистрирайте се.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
