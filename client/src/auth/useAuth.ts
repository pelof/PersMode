import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
// hämtar info om inloggad
export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Hämtar info om inloggad användare
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/me", {
        credentials: "include",
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Registrera ny användare
  const registerMutation = useMutation({
    mutationFn: async (user: {
      email: string;
      password: string;
      role: string;
    }) => {
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

  // Logga in
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

  // Logga ut
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate({ to: "/" });
    },
  });

  return {
    user,
    isLoading,
    register: (user: { email: string; password: string; role: string }) =>
      registerMutation.mutate(user),
    login: (credentials: { email: string; password: string }) =>
      loginMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,
    loginStatus: loginMutation.status,
  };
}
