import React from "react";
import { CiSearch } from "react-icons/ci";

const Searchbar = () => {
  return (
    <div className="flex items-center w-full group">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search for artists, songs, or albums"
          className="w-full bg-white/10 border border-white/5 text-gray-200 placeholder-gray-500 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:bg-white/15 focus:border-white/10 transition-all text-sm"
        />
        <CiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={20} />
      </div>
    </div>
  );
};

export default Searchbar;
