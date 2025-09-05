import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// hämtar info om inloggad
export function useAuth() {
const queryClient = useQueryClient();

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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

//   return { user, isLoading, logout: logoutMutation.mutate };
return { user, isLoading, logout: () => logoutMutation.mutate() };

}