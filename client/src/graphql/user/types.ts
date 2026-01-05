export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  profileBio?: string;
}

export interface UserProfile {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  profileBio?: string;
  updatedAt: string;
}

export interface UpdateMyProfileResponse {
  updateMyProfile: UserProfile;
}

export interface UpdateMyProfileVariables {
  input: UpdateUserProfileInput;
}
