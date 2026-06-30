import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate, formatFollowersDetail, formatNumber } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import {
  ArrowLeft,
  Users,
  Percent,
  FileText,
  Heart,
  MessageSquare,
  Eye,
  Activity,
  Plus,
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { addInfluencer, removeInfluencer, isSaved } = useInfluencerStore();

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-red-400 mb-4 font-semibold">Invalid profile selected</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to search</span>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="w-full h-96 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Analyzing profile data...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="text-center py-16 glass-card rounded-3xl max-w-xl mx-auto p-8 border border-white/5">
          <p className="text-red-400 font-bold text-lg mb-2">Profile Not Found</p>
          <p className="text-sm text-gray-500 mb-6">
            Could not retrieve profile statistics for the creator username <strong>@{username}</strong>.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to search</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const saved = isSaved(user.user_id);

  const handleToggleSave = () => {
    if (saved) {
      removeInfluencer(user.user_id);
    } else {
      addInfluencer(user, platform);
    }
  };

  const getPlatformColors = (plat: Platform) => {
    switch (plat) {
      case "instagram":
        return {
          glow: "border-pink-500/30 shadow-[0_0_40px_-5px_rgba(219,39,119,0.3)]",
          badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          text: "text-pink-400"
        };
      case "youtube":
        return {
          glow: "border-red-500/30 shadow-[0_0_40px_-5px_rgba(239,68,68,0.3)]",
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
          text: "text-red-400"
        };
      case "tiktok":
        return {
          glow: "border-cyan-500/30 shadow-[0_0_40px_-5px_rgba(6,182,212,0.3)]",
          badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          text: "text-cyan-400"
        };
    }
  };

  const colors = getPlatformColors(platform);

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <Link to="/" className="hover:text-purple-400 transition-colors">Search</Link>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300">@{user.username}</span>
        </div>

        {/* Hero Section */}
        <div className="p-6 md:p-8 glass-panel rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Platform Accent Glow Background */}
          <div className={`absolute -top-24 -left-24 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full pointer-events-none`} />

          {/* Picture */}
          <div className="relative flex-shrink-0">
            <img
              src={user.picture}
              alt={user.fullname}
              className={`w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 ${colors.glow}`}
            />
          </div>

          {/* Identity & Bio */}
          <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-1.5">
                  @{user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </h2>
                <span className={`inline-flex self-center md:self-auto text-xs px-2.5 py-0.5 rounded-full border font-bold capitalize ${colors.badge}`}>
                  {platform}
                </span>
              </div>
              <p className="text-gray-400 font-medium text-base mt-1">{user.fullname}</p>
            </div>

            {user.description && (
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                {user.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <span>View Platform Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              )}

              <button
                onClick={handleToggleSave}
                className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-300 ${
                  saved
                    ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                    : "bg-purple-600 hover:bg-purple-700 text-white border-transparent hover:shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]"
                }`}
              >
                {saved ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Remove from Campaign</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Campaign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
            Performance Indicators
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Followers Card */}
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider">Followers</span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {formatFollowersDetail(user.followers)}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Total subscriber reach</p>
              </div>
            </div>

            {/* Engagement Rate Card */}
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider">Engagement Rate</span>
                <Percent className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-white">
                  {formatEngagementRate(user.engagement_rate)}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Interaction ratio per post</p>
              </div>
            </div>

            {/* Total Engagements Card (Fixed Bug: Display count formatted, not rate) */}
            {user.engagements !== undefined && (
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-gray-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Engagements</span>
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {formatNumber(user.engagements)}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Cumulative action responses</p>
                </div>
              </div>
            )}

            {/* Posts Count Card */}
            {user.posts_count !== undefined && (
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-gray-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Content</span>
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {formatNumber(user.posts_count)}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Published media posts</p>
                </div>
              </div>
            )}

            {/* Avg Likes Card */}
            {user.avg_likes !== undefined && (
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-gray-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Average Likes</span>
                  <Heart className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {formatFollowersDetail(user.avg_likes)}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Average likes per media item</p>
                </div>
              </div>
            )}

            {/* Avg Comments Card */}
            {user.avg_comments !== undefined && (
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-gray-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Average Comments</span>
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {formatNumber(user.avg_comments)}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Average comments per post</p>
                </div>
              </div>
            )}

            {/* Avg Views Card */}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-gray-500 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Average Views</span>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {formatFollowersDetail(user.avg_views)}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Average views per video/reel</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
