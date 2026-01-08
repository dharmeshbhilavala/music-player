// src/components/MainPanel.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMusic } from "../slice/musicSlice";

import Navbar from "./Navbar";
import ArtistProfile from "./ArtistProfile";
import SongList from "./SongList";

const MainPanel = () => {
  const dispatch = useDispatch();
  const musicStatus = useSelector((state) => state.music?.status);
  const error = useSelector((state) => state.music?.error);
  const currentView = useSelector((state) => state.music?.currentView);

  useEffect(() => {
    if (musicStatus === "idle") {
      dispatch(fetchMusic());
    }
  }, [musicStatus, dispatch]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      <div className="h-full overflow-y-auto custom-scrollbar px-8 pb-8">
        <Navbar />

        {/* Content based on view */}
        {(() => {
          if (musicStatus === "loading") {
            return (
              <div className="flex justify-center items-center h-64 text-red-500">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
              </div>
            );
          }
          if (musicStatus === "failed") {
            return (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                {error || "Something went wrong fetching music."}
              </div>
            );
          }

          if (currentView === "settings") {
            return (
              <div className="flex flex-col gap-6 text-white max-w-2xl mx-auto mt-10">
                <h2 className="text-3xl font-bold">Settings</h2>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Account</h3>
                  <p className="text-gray-400 mb-4">Manage your account information and preferences.</p>
                  <button className="px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold hover:bg-red-500 transition-colors">Edit Profile</button>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Playback</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">High Quality Audio</span>
                    <div className="w-10 h-6 bg-green-500 rounded-full cursor-pointer relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Cross-fade Songs</span>
                    <div className="w-10 h-6 bg-gray-600 rounded-full cursor-pointer relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          if (currentView === "trends" || currentView === "discover") {
            // Reuse SongList but maybe we can fetch different data later
            // For now, let's just show the list but with a different header or simple placeholder if empty
            return (
              <div className="flex flex-col gap-8">
                <div className="h-60 rounded-3xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center p-8 text-center">
                  <div>
                    <h1 className="text-5xl font-black text-white mb-2">{currentView === "trends" ? "Trending Now" : "Discover New Music"}</h1>
                    <p className="text-white/80 text-lg">The hottest tracks right now, updated daily.</p>
                  </div>
                </div>
                <SongList />
              </div>
            );
          }

          // Default: Home or Library
          return (
            <div className="flex flex-col gap-8">
              <ArtistProfile />
              <SongList />
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default MainPanel;
