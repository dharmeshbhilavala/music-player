import React from "react";
import { CiSearch } from "react-icons/ci";

const Searchbar = () => {
  return (
    <div className="flex items-center w-full max-w-[500px]">
      <input
        type="text"
        placeholder="Search"
        className="text-white w-full focus:outline-none bg-red-950 rounded-s-full p-1.5 px-4"
      />
      <CiSearch size={20} className="px-4 p-1 text-white w-16 h-9 bg-red-950 rounded-e-full" />
    </div>
  );
};

export default Searchbar;
