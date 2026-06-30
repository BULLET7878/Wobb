import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { formatFollowers } from "@/utils/formatters";
import { Plus, Check, Users } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

const PlatformBadge = memo(({ platform }: { platform: Platform }) => {
  switch (platform) {
    case "instagram":
      return <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">Instagram</span>;
    case "youtube":
      return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">YouTube</span>;
    case "tiktok":
      return <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">TikTok</span>;
  }
});
PlatformBadge.displayName = "PlatformBadge";

const PlatformDot = memo(({ platform }: { platform: Platform }) => {
  switch (platform) {
    case "instagram":
      return <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-bold" aria-label="Instagram">I</div>;
    case "youtube":
      return <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px] font-bold" aria-label="YouTube">Y</div>;
    case "tiktok":
      return <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-black text-[8px] font-bold" aria-label="TikTok">T</div>;
  }
});
PlatformDot.displayName = "PlatformDot";

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const addInfluencer = useInfluencerStore((s) => s.addInfluencer);
  const removeInfluencer = useInfluencerStore((s) => s.removeInfluencer);
  const saved = useInfluencerStore((s) => s.isSaved(profile.user_id));

  const handleClick = useCallback(() => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, onProfileClick, profile.username, platform]);

  const handleToggleSave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeInfluencer(profile.user_id);
    } else {
      addInfluencer(profile, platform);
    }
  }, [saved, removeInfluencer, addInfluencer, profile, platform]);

  return (
    <article
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View profile of ${profile.fullname}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="flex items-center gap-4 p-4 glass-card rounded-2xl cursor-pointer w-full text-left relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      data-search={searchQuery}
    >
      {/* Background glow hover effect */}
      <div className="absolute -inset-y-10 -left-10 w-24 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all duration-500 rounded-full pointer-events-none" aria-hidden="true" />

      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <img
          src={profile.picture}
          alt={`${profile.fullname} profile photo`}
          className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/40 transition-colors duration-300"
          loading="lazy"
          width={56}
          height={56}
        />
        <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5" aria-hidden="true">
          <PlatformDot platform={platform} />
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-bold text-white text-base truncate group-hover:text-purple-300 transition-colors duration-300">
            @{profile.username}
          </h3>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-sm text-gray-400 truncate mb-2">{profile.fullname}</p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-300 font-medium">
            <Users className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <span>{formatFollowers(profile.followers)} followers</span>
          </div>
          <PlatformBadge platform={platform} />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleToggleSave}
        aria-label={saved ? `Remove ${profile.fullname} from campaign list` : `Add ${profile.fullname} to campaign list`}
        aria-pressed={saved}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-300 flex-shrink-0 ${
          saved
            ? "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]"
            : "bg-purple-600 hover:bg-purple-700 text-white border-transparent hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
        }`}
      >
        {saved ? (
          <>
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add to List</span>
          </>
        )}
      </button>
    </article>
  );
});
