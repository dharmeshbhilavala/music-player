import React from "react";
import Searchbar from "../components/SearchBar";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between items-center mb-8 sticky top-0 z-10 py-4 bg-black/40 backdrop-blur-md -mx-4 px-8 border-b border-white/5">
      <nav className="flex gap-8 text-gray-400 font-medium text-sm">
        <button className="text-white border-b-2 border-red-500 pb-1">Music</button>
        <button className="hover:text-white transition-colors">Podcast</button>
        <button className="hover:text-white transition-colors">Live</button>
        <button className="hover:text-white transition-colors">Radio</button>
      </nav>
      <div className="w-1/3 min-w-[300px]">
        <Searchbar />
      </div>
    </div>
  );
};

export default Navbar;
