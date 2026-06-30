import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize profile data — only recalculates when platform changes
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  // Memoize filtered profiles — recalculates only when allProfiles or query changes
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  // Stable callback to avoid ProfileList re-renders
  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  return (
    <Layout>
      {/* Hero Header */}
      <div className="w-full text-center max-w-xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Search <span className="text-gradient">Influencers</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Discover and analyze top social media creators across platforms.
        </p>
      </div>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Results Count Bar */}
      <div className="w-full flex justify-between items-center max-w-4xl mx-auto mb-4 px-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Results
        </span>
        <span className="text-xs text-gray-500 font-medium bg-white/5 px-2.5 py-1 rounded-lg border border-white/5" aria-live="polite">
          Showing{" "}
          <strong className="text-purple-400">{filtered.length}</strong> of{" "}
          {allProfiles.length} on {platform}
        </span>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={() => {}}
      />
    </Layout>
  );
}
