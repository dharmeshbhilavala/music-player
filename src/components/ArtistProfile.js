// src/components/ArtistProfile.js
import React from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaLaptop } from "react-icons/fa";

const ArtistProfile = () => {
  const musicList = useSelector((state) => state?.music?.musicList);
  const localMusicList = useSelector((state) => state?.music?.localMusicList);
  const nowPlaying = useSelector((state) => state?.music?.nowPlaying);
  const currentView = useSelector((state) => state?.music?.currentView);

  if (currentView === 'library') {
    const trackCount = localMusicList?.length || 0;
    return (
      <div className="relative w-full h-80 rounded-3xl overflow-hidden group bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-300">
            <FaLaptop />
            <span className="text-sm font-semibold tracking-wide uppercase">Local Device</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg">My Library</h1>
          <p className="text-indigo-200 text-sm mt-2 font-medium">
            {trackCount} songs stored locally
          </p>
        </div>
      </div>
    );
  }

  // Determine the track data source
  const currentTrack = nowPlaying?.track || nowPlaying || musicList?.[0]?.track || musicList?.[0];

  const artist = currentTrack?.artists?.items?.[0]?.profile?.name
    || currentTrack?.artists?.[0]?.name
    || "Unknown Artist";

  // Use a high-quality image if available, otherwise fallback
  const heroImage = currentTrack?.album?.images?.[0]?.url;

  return (
    <div className="relative w-full h-80 rounded-3xl overflow-hidden group bg-gray-900">
      {/* Background Image */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-blue-400">
          <FaCheckCircle />
          <span className="text-sm font-semibold tracking-wide uppercase">Verified Artist</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg">{artist}</h1>
        <p className="text-gray-300 text-sm mt-2 max-w-lg">
          24,123,551 monthly listeners
        </p>
      </div>
    </div>
  );
};

export default ArtistProfile;
