import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface SavedInfluencer {
  profile: UserProfileSummary;
  platform: Platform;
  addedAt: string;
}

interface InfluencerStore {
  savedInfluencers: SavedInfluencer[];
  addInfluencer: (profile: UserProfileSummary, platform: Platform) => void;
  removeInfluencer: (userId: string) => void;
  clearList: () => void;
  isSaved: (userId: string) => boolean;
}

export const useInfluencerStore = create<InfluencerStore>()(
  persist(
    (set, get) => ({
      savedInfluencers: [],
      addInfluencer: (profile, platform) => {
        const current = get().savedInfluencers;
        if (current.some((item) => item.profile.user_id === profile.user_id)) {
          return;
        }
        set({
          savedInfluencers: [
            ...current,
            { profile, platform, addedAt: new Date().toISOString() },
          ],
        });
      },
      removeInfluencer: (userId) => {
        set({
          savedInfluencers: get().savedInfluencers.filter(
            (item) => item.profile.user_id !== userId
          ),
        });
      },
      clearList: () => {
        set({ savedInfluencers: [] });
      },
      isSaved: (userId) => {
        return get().savedInfluencers.some((item) => item.profile.user_id === userId);
      },
    }),
    {
      name: "wobb-influencers",
    }
  )
);
