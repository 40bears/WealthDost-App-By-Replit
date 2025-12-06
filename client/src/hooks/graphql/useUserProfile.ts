import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Type definitions based on the backend schema
export interface UserProfileData {
  id: string;
  uuid: string;
  email: string;
  username: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  kycStatus: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  fullName: string;
  profileBio: string | null;
  detailedBio: string | null;
  experienceLevel: string | null;
  interests: string[];
  industrySectors: string[];
  topics: string[];
  riskLevel: string | null;
  returnTarget: string | null;
  riskPersona: string | null;
  followedExperts: string[];
  totalPosts: number;
  likesReceived: number;
  totalComments: number;
  watchlistCount: number;
}

// Query for logged-in user's profile
const MY_PROFILE_QUERY = gql`
  query MyProfile {
    myProfile {
      id
      uuid
      email
      username
      firstName
      lastName
      phone
      isActive
      kycStatus
      roles
      createdAt
      updatedAt
      fullName
      profileBio
      detailedBio
      experienceLevel
      interests
      industrySectors
      topics
      riskLevel
      returnTarget
      riskPersona
      followedExperts
      totalPosts
      likesReceived
      totalComments
      watchlistCount
    }
  }
`;

// Query for other user's profile by UUID
const USER_PROFILE_QUERY = gql`
  query UserProfile($uuid: String!) {
    userProfile(uuid: $uuid) {
      id
      uuid
      email
      username
      firstName
      lastName
      phone
      isActive
      kycStatus
      roles
      createdAt
      updatedAt
      fullName
      profileBio
      detailedBio
      experienceLevel
      interests
      industrySectors
      topics
      riskLevel
      returnTarget
      riskPersona
      followedExperts
      totalPosts
      likesReceived
      totalComments
      watchlistCount
    }
  }
`;

// Hook for getting logged-in user's profile
export function useMyProfile() {
  return useQuery<{ myProfile: UserProfileData }>(MY_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
}

// Hook for getting another user's profile by UUID
export function useUserProfile(uuid: string) {
  return useQuery<{ userProfile: UserProfileData }>(USER_PROFILE_QUERY, {
    variables: { uuid },
    fetchPolicy: 'cache-and-network',
    skip: !uuid || uuid === 'unknown',
  });
}
