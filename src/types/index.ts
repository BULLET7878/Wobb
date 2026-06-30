export type Platform = "instagram" | "youtube" | "tiktok";

export interface CreatorProfile {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
  custom_name?: string;
}

export interface SearchResultAccount {
  account: {
    user_profile: CreatorProfile;
    audience_source: string;
  };
}

export interface SearchResponse {
  total: number;
  accounts: SearchResultAccount[];
}

export interface CreatorDetail extends CreatorProfile {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
}

export interface DetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: CreatorDetail;
  };
}
