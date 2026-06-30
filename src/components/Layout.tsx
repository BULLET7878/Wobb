import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Compass } from "lucide-react";
import { useInfluencerStore } from "@/store/useInfluencerStore";
import { SavedInfluencerDrawer } from "./SavedInfluencerDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const savedCount = useInfluencerStore((state) => state.savedInfluencers.length);

  return (
    <div className="min-h-screen bg-[#080710] text-[#f3f4f6] flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#080710]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
              Wobb<span className="text-purple-400 font-medium">Index</span>
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 text-sm font-semibold cursor-pointer transition-all duration-300 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_-2px_rgba(168,85,247,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Campaign List</span>
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                {savedCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col">
        {title && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full" />
          </div>
        )}
        <div className="flex-1 w-full flex flex-col items-center">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-gray-600 bg-black/10 mt-auto">
        <p>© 2026 Wobb Influencer Index. Designed for high performance creator search.</p>
      </footer>

      {/* Global Saved Drawer */}
      <SavedInfluencerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
