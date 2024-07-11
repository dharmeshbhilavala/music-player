// src/components/NowPlaying.js
import React from "react";
import MusicPlayingCard from "./MusicPlayingCard";

const NowPlaying = () => {
  return (
    <div className="bg-gradient-to-b from-red-950 to-gray-950 text-white p-4 w-1/6 min-w-fit flex items-end">
      <MusicPlayingCard />
    </div>
  );
};

export default NowPlaying;
