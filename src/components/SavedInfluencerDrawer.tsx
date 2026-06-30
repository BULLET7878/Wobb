import { useState } from "react";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { formatFollowersDetail, formatEngagementRate } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { X, Trash2, Copy, Download, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import type { Platform } from "@/types";

interface SavedInfluencerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedInfluencerDrawer({ isOpen, onClose }: SavedInfluencerDrawerProps) {
  const { savedInfluencers, removeInfluencer, clearList } = useInfluencerStore();
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  // Aggregate stats calculations
  const totalReach = savedInfluencers.reduce((sum, item) => sum + item.profile.followers, 0);

  // Compute average engagement rate (filter out undefined rates)
  const influencersWithRate = savedInfluencers.filter(
    (item) => item.profile.engagement_rate !== undefined
  );
  const avgEngagementRate =
    influencersWithRate.length > 0
      ? influencersWithRate.reduce((sum, item) => sum + (item.profile.engagement_rate || 0), 0) /
        influencersWithRate.length
      : undefined;

  // Platform breakdown counts
  const platformCounts = savedInfluencers.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {} as Record<Platform, number>);

  // Copy handles to clipboard
  const handleCopyHandles = () => {
    if (savedInfluencers.length === 0) return;
    const handlesText = savedInfluencers.map((item) => `@${item.profile.username}`).join(", ");
    navigator.clipboard.writeText(handlesText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (savedInfluencers.length === 0) return;
    const headers = ["User ID", "Username", "Full Name", "Platform", "Followers", "Engagement Rate", "Profile URL"];
    const rows = savedInfluencers.map((item) => [
      item.profile.user_id,
      item.profile.username,
      item.profile.fullname.replace(/"/g, '""'),
      getPlatformLabel(item.platform),
      item.profile.followers,
      item.profile.engagement_rate !== undefined ? `${(item.profile.engagement_rate * 100).toFixed(2)}%` : "N/A",
      item.profile.url,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wobb_campaign_list_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as JSON
  const handleExportJSON = () => {
    if (savedInfluencers.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedInfluencers, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `wobb_campaign_list_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden animate-fade-in">
      {/* Overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full glass-panel shadow-2xl flex flex-col z-10 animate-slide-in border-l border-white/10 text-left">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Campaign List</h2>
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
              {savedInfluencers.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {savedInfluencers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4 border border-white/5">
                <Sparkles className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-white font-medium mb-1">Your list is empty</h3>
              <p className="text-sm text-gray-500 max-w-[240px]">
                Add creators to your list while searching to compile your outreach campaign.
              </p>
            </div>
          ) : (
            <>
              {/* Aggregate Statistics Block */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Total Reach</div>
                  <div className="text-xl font-black text-white">{formatFollowersDetail(totalReach)}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Cumulative Followers</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Avg Engagement</div>
                  <div className="text-xl font-black text-white">
                    {avgEngagementRate !== undefined ? formatEngagementRate(avgEngagementRate) : "N/A"}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Across platform list</div>
                </div>
              </div>

              {/* Platform breakdown */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-3.5 space-y-2">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Platform Breakdown</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(["instagram", "youtube", "tiktok"] as Platform[]).map((platform) => {
                    const count = platformCounts[platform] || 0;
                    const colors = {
                      instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
                      youtube: "bg-red-500/10 text-red-400 border-red-500/20",
                      tiktok: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                    };
                    return (
                      <span
                        key={platform}
                        className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${colors[platform]}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{getPlatformLabel(platform)}: <strong>{count}</strong></span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Quick List Action Bar */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopyHandles}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs font-semibold cursor-pointer transition-all duration-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess ? "Copied!" : "Copy Handles"}</span>
                </button>

                <div className="flex gap-1.5">
                  <button
                    onClick={handleExportCSV}
                    title="Export as CSV"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportJSON}
                    title="Export as JSON"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-200"
                  >
                    <span className="text-[10px] font-bold px-0.5">{"{}"}</span>
                  </button>
                </div>
              </div>

              {/* Saved Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Creators</span>
                  <button
                    onClick={clearList}
                    className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {savedInfluencers.map(({ profile, platform }) => (
                    <div
                      key={profile.user_id}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all duration-200 group/item"
                    >
                      <img
                        src={profile.picture}
                        alt={profile.fullname}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/profile/${profile.username}?platform=${platform}`}
                            onClick={onClose}
                            className="font-bold text-xs text-white hover:text-purple-400 hover:underline truncate inline-flex items-center gap-0.5"
                          >
                            @{profile.username}
                            <ExternalLink className="w-2.5 h-2.5 text-gray-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span>{formatFollowersDetail(profile.followers)} followers</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="capitalize">{platform}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeInfluencer(profile.user_id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
