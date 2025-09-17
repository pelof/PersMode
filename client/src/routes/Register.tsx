import { useState } from "react";
import { useAuth } from "@/auth/useAuth";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const { register, registerStatus, registerError } = useAuth();

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    register({ email, password, role });
  }

  return (
    <>
      <h1 className="text-2xl text-center my-5">Registrera dig</h1>
      <div className="flex justify-center">
        <form onSubmit={handleRegister} className="w-full max-w-xl">
          <div className="my-5">
            <label htmlFor="email">E-Post</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          <div>
            <input
              type="checkbox"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.checked ? "admin" : "user")}
            />{" "}
            <span>admin</span>
          </div>

          {registerError && (
            <p className="text-red-600">Något gick fel vid registrering.</p>
          )}
          {registerStatus === "pending" && (
            <p className="text-gray-600">Registrerar...</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              aria-label="Registrera dig"
              className="bg-blue-500 text-white rounded px-4 py-2 my-5 hover:bg-blue-700 hover:cursor-pointer"
            >
              Registrera dig
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
