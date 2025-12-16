import { useQuery } from '@apollo/client/react';
import { GET_EXPERTS } from '@/graphql/experts/queries';

export interface ExpertProfile {
  profileBio?: string;
  industrySectors?: string;
  experienceLevel?: string;
  interests?: string[];
  topics?: string[];
  specializations?: string[];
  achievements?: string[];
}

export interface Expert {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  roles: string[];
  kycStatus: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: ExpertProfile;
}

export interface GetExpertsVariables {
  specialization?: string;
}

export interface GetExpertsResponse {
  experts: Expert[];
}

export const useExperts = (specialization?: string) => {
  return useQuery<GetExpertsResponse, GetExpertsVariables>(GET_EXPERTS, {
    variables: {
      specialization: specialization && specialization !== 'all' ? specialization : undefined,
    },
    fetchPolicy: 'cache-and-network',
  });
};
