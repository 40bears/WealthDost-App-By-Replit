import { User } from "@/types";
import { useEffect, useState } from "react";


export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user?.id;

  const getRole = (): 'investor' | 'expert' | null => {
    if (!user?.roles || user.roles.length === 0) return null;
    const role = user.roles[0];
    if (role === 'investor' || role === 'expert') return role;
    return null;
  };

  const role = getRole();
  const isInvestor = role === 'investor';
  const isExpert = role === 'expert';

  return {
    user,
    isLoading,
    isAuthenticated,
    role,
    isInvestor,
    isExpert,
    login,
    logout
  };
};