import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (user: { email: string; password: string; role: string }) => {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel");
      return data;
    },
    onSuccess: () => {
      navigate({ to: "/login" }); // skicka användaren till login efter registrering
    },
  });

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    registerMutation.mutate({ email, password, role });
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
              type="text"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          <div>
            <input type="checkbox" onChange={(e) => setRole(e.target.checked ? "admin" : "user")} /> <span>admin</span>
          </div>

          {registerMutation.isError && (
            <p className="text-red-600">
              {(registerMutation.error as Error).message}
            </p>
          )}
          {registerMutation.isSuccess && (
            <p className="text-green-600">
              Konto skapat! Du skickas vidare till login...
            </p>
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
