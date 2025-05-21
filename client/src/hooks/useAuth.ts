import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users/1"], // In a real app, this would be based on a session or token
    retry: false,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
  };
}
