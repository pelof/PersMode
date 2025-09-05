import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const queryClient = useQueryClient();


  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate({ to: "/" }); // flytta användaren till startsidan
    },
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <>
      <h1 className="text-2xl text-center my-5">Logga in</h1>
      <div className="flex justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xl">
          <div className="my-5">
            <label htmlFor="">E-Post</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Lösenord</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 rounded px-3 py-1 mt-2 w-full"
            />
          </div>
          {loginMutation.isError && (
            <p className="text-red-600">
              {(loginMutation.error as Error).message}
            </p>
          )}
          {loginMutation.isSuccess && (
            <p className="text-green-600">
              Konto skapat! Du skickas vidare till login...
            </p>
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
