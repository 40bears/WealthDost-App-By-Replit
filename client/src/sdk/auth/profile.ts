import { apiClient } from "@/lib/api";
import { User } from "@/types";

export const getProfile = async (accessToken: string): Promise<User> => {
  const res = await apiClient.auth.profile.$get({
    config: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  return res;
};
