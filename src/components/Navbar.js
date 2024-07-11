import React from "react";
import Searchbar from "../components/SearchBar";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between">
      <nav className="text-white p-4 w-2/4 max-w-[400px] flex justify-around">
        <button className="mr-4 font-bold">Music</button>
        <button className="mr-4 font-bold">Podcast</button>
        <button className="mr-4 font-bold">Live</button>
        <button className="mr-4 font-bold">Radio</button>
      </nav>
      <Searchbar />
    </div>
  );
};

export default Navbar;
