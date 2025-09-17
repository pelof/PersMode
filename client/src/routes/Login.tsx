import { useAuth } from "@/auth/useAuth";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loginStatus } = useAuth();


  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <>
      <h1 className="text-2xl text-center my-5">Logga in</h1>
      <div className="flex justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xl">
          <div className="my-5">
            <label htmlFor="">E-Post</label>
            <input
              id="email"
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Lösenord</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          {/* Visa felmeddelande om login failade */}
          {loginStatus === "error" && (
            <p className="text-red-600">Något gick fel vid inloggning.</p>
          )}

          {/* Visa loading om pågående */}
          {loginStatus === "pending" && (
            <p className="text-gray-600">Loggar in...</p>
          )}
          <div className="flex justify-between">
            <Link
              to="/register"
              className="bg-blue-500 text-white rounded px-4 py-2 my-5 hover:bg-blue-700 hover:cursor-pointer"
            >
              Registrera nytt konto
            </Link>
            <button
              type="submit"
              aria-label="Logga in"
              className="bg-blue-500 text-white rounded px-4 py-2 my-5 hover:bg-blue-700 hover:cursor-pointer"
            >
              Logga in
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
