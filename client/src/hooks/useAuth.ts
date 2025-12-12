import { User } from "@/types";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // If user data already has kycStatus, use it; otherwise try to fetch
          if (userData.kycStatus !== undefined) {
            setUser(userData);
          } else {
            // Try to fetch fresh profile data if kycStatus is missing
            try {
              console.log('Fetching profile data...');
              const profileResponse = await apiClient.auth.profile.get();
              console.log('Profile response:', profileResponse.body);
              const updatedUser = { ...userData, ...profileResponse.body };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
              console.error('Failed to fetch profile:', error);
              // Fall back to stored user data
              setUser(userData);
            }
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        console.log('Manually refreshing profile...');
        const profileResponse = await apiClient.auth.profile.get();
        console.log('Profile response:', profileResponse.body);
        const updatedUser = { ...user, ...profileResponse.body };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } catch (error) {
        console.error('Failed to refresh profile:', error);
        throw error;
      }
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user?.id;

  const getRole = (): 'investor' | 'expert' | 'admin' | null => {
    if (!user?.roles || user.roles.length === 0) return null;
    const role = user.roles[0];
    if (role === 'investor' || role === 'expert' || role === 'admin') return role;
    return null;
  };

  const role = getRole();
  const isInvestor = role === 'investor';
  const isExpert = role === 'expert';
  const isAdmin = user?.roles?.includes('admin') || false;

  return {
    user,
    isLoading,
    isAuthenticated,
    role,
    isInvestor,
    isExpert,
    isAdmin,
    login,
    logout,
    refreshProfile
  };
};