declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  username: string;
  roles?: unknown[];
  isActive: boolean;
  isLoggedIn?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'investor' | 'expert';
  profile_image?: string;
  bio?: string;
  location?: string;
  risk_tolerance?: string;
  investment_style?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface VerifyOtpResponse {
  flow: 'login' | 'register';
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface VerifyRegistrationResponse {
  flow: 'login' | 'register';
  accessToken?: string;
  refreshToken?: string;
}
