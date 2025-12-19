export interface MasterHashtag {
  id: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMasterHashtagsData {
  masterHashtags: MasterHashtag[];
}

export interface GetUserInterestsData {
  userInterests: MasterHashtag[];
}
