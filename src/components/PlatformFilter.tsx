import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, X } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  // SVG Icons for each platform
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case "youtube":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        );
      case "tiktok":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        );
    }
  };

  const getPlatformStyles = (platform: Platform, isActive: boolean) => {
    if (!isActive) {
      return "border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/5 hover:border-white/10";
    }
    switch (platform) {
      case "instagram":
        return "border-pink-500/50 bg-pink-500/10 text-pink-400 shadow-[0_0_15px_-3px_rgba(219,39,119,0.3)]";
      case "youtube":
        return "border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]";
      case "tiktok":
        return "border-cyan-400/50 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-5 mb-8">
      {/* Platform Selector Tabs */}
      <div className="flex p-1.5 glass-panel rounded-2xl w-full justify-between items-center gap-1.5">
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border cursor-pointer ${getPlatformStyles(
                p,
                isActive
              )}`}
            >
              {getPlatformIcon(p)}
              <span>{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>

      {/* Styled Search Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators by username or name...`}
          className="w-full pl-11 pr-11 py-3.5 glass-input rounded-2xl text-sm placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
