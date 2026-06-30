import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchResponse, CreatorProfile } from "@/types";

const platformData: Record<Platform, SearchResponse> = {
  instagram: instagramData as SearchResponse,
  youtube: youtubeData as SearchResponse,
  tiktok: tiktokData as SearchResponse,
};

export function getSearchData(platform: Platform): SearchResponse {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): CreatorProfile[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => {
    const profile = item.account.user_profile;
    return {
      ...profile,
      username: profile.username || profile.handle || profile.custom_name || profile.user_id,
    };
  });
}

export function filterProfiles(
  profiles: CreatorProfile[],
  query: string
): CreatorProfile[] {
  if (!query) return profiles;
  const lowercaseQuery = query.toLowerCase();
  return profiles.filter((p) => {
    const username = p.username || "";
    const fullname = p.fullname || "";
    const matchUsername = username.toLowerCase().includes(lowercaseQuery);
    const matchFullname = fullname.toLowerCase().includes(lowercaseQuery);
    return matchUsername || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}
