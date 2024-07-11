// src/App.js
import React from "react";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import NowPlaying from "./components/NowPlaying";

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainPanel />
      <NowPlaying />
    </div>
  );
};

export default App;
