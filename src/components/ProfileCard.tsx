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

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addInfluencer, removeInfluencer, isSaved } = useInfluencerStore();

  const saved = isSaved(profile.user_id);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeInfluencer(profile.user_id);
    } else {
      addInfluencer(profile, platform);
    }
  };

  // Helper for platform tags
  const getPlatformBadge = (plat: Platform) => {
    switch (plat) {
      case "instagram":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">Instagram</span>;
      case "youtube":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">YouTube</span>;
      case "tiktok":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">TikTok</span>;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 p-4 glass-card rounded-2xl cursor-pointer w-full text-left relative overflow-hidden group"
      data-search={searchQuery}
    >
      {/* Background glow hover effect */}
      <div className="absolute -inset-y-10 -left-10 w-24 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all duration-500 rounded-full pointer-events-none" />

      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <img
          src={profile.picture}
          alt={profile.fullname}
          className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/40 transition-colors duration-300"
          loading="lazy"
        />
        <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
          {/* Small platform glyph indicators */}
          {platform === "instagram" && (
            <div className="w-4.5 h-4.5 rounded-full bg-pink-500 flex items-center justify-center text-white text-[8px] font-bold">I</div>
          )}
          {platform === "youtube" && (
            <div className="w-4.5 h-4.5 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px] font-bold">Y</div>
          )}
          {platform === "tiktok" && (
            <div className="w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-black text-[8px] font-bold">T</div>
          )}
        </div>
      </div>

      {/* Profile Metrics and Names */}
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
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatFollowers(profile.followers)} followers</span>
          </div>
          {getPlatformBadge(platform)}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleToggleSave}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all duration-300 flex-shrink-0 ${
          saved
            ? "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]"
            : "bg-purple-600 hover:bg-purple-700 text-white border-transparent hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
        }`}
      >
        {saved ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Save List</span>
          </>
        )}
      </button>
    </div>
  );
}
