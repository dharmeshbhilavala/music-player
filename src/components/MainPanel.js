// src/components/MainPanel.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMusic } from "../slice/musicSlice";

import Navbar from "./Navbar";
import ArtistProfile from "./ArtistProfile";
import SongList from "./SongList";

const MainPanel = () => {
  const dispatch = useDispatch();
  const musicList = useSelector((state) => state.music?.musicList);
  const musicStatus = useSelector((state) => state.music?.status);
  const error = useSelector((state) => state.music?.error);

  useEffect(() => {
    if (musicStatus === "idle") {
      dispatch(fetchMusic());
    }
  }, [musicStatus, dispatch]);

  return (
    <div className=" text-white flex-grow p-4  bg-gradient-to-b from-red-900 to-gray-950 h-screen items-center justify-center">
      <Navbar />
      {musicStatus === "loading" && (
        <div className="flex justify-center items-center animate-bounce mt-10 ">Loading...</div>
      )}
      {musicStatus === "succeeded" && (
        <>
          <ArtistProfile />
          <SongList />
        </>
      )}
      {musicStatus === "failed" && <div>{error}</div>}
    </div>
  );
};

export default MainPanel;
