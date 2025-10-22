/**
 * Get the current user's username from localStorage
 * @returns The username or "User" as fallback
 */
export const getUsername = (): string => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.username || "User";
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }
  return "User";
};

/**
 * Get the current user object from localStorage
 * @returns The user object or null
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }
  return null;
};