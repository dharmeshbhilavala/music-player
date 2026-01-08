import React from "react";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import MusicPlayingCard from "./components/MusicPlayingCard";

const App = () => {
  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden relative selection:bg-red-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Layout */}
      <Sidebar />
      <MainPanel />
      
      {/* Right Content / Player */}
      <div className="w-80 h-full border-l border-white/5 bg-black/20 backdrop-blur-md hidden lg:flex flex-col p-6 gap-6">
        <h3 className="text-lg font-bold text-gray-200">Player</h3>
        <MusicPlayingCard />
      </div>
    </div>
  );
};

export default App;
