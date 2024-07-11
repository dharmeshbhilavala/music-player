// src/components/ArtistProfile.js
import React from "react";
import { useSelector } from "react-redux";

const ArtistProfile = () => {
  const musicList = useSelector((state) => state?.music?.musicList);
  const nowPlaying = useSelector((state) => state?.music?.nowPlaying);
  const artist = musicList[0]?.track?.artists?.items[0]?.profile?.name;

  return (
    <div className="text-white p-4">
      <img src={nowPlaying?.album?.images[0]?.url} alt="artist" className="w-full h-64 object-cover rounded-lg mb-4" />
      <h2 className="text-xl font-semibold mt-4">{artist}</h2>
    </div>
  );
};

export default ArtistProfile;
