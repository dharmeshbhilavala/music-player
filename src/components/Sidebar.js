// src/components/Sidebar.js
import React from "react";
import { IoMusicalNotes } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setView } from "../slice/musicSlice";
import { SIDE_BAR_GENERAL_MENU, SIDE_BAR_MENU } from "../utils/constant";

const Sidebar = () => {
  const dispatch = useDispatch();
  const currentView = useSelector((state) => state.music.currentView);

  const handleMenuClick = (menuName) => {
    if (menuName === "Home") {
      dispatch(setView("home"));
    } else if (menuName === "Library") {
      dispatch(setView("library"));
    } else if (menuName === "Trends") {
      dispatch(setView("trends"));
    } else if (menuName === "Discover") {
      dispatch(setView("discover"));
    } else if (menuName === "Settings") {
      dispatch(setView("settings"));
    }
  };



  const getActiveState = (menuName) => {
    // Normalize comparison to handle casing if needed, but strict is fine for now
    return menuName.toLowerCase() === currentView;
  };

  return (
    <div className="h-full w-64 flex flex-col p-6 sticky top-0 bg-transparent border-r border-white/5 backdrop-blur-sm z-20 hidden md:flex">
      {/* Title */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-gradient-to-tr from-red-600 to-red-400 text-white p-2 rounded-xl shadow-lg shadow-red-500/20">
          <IoMusicalNotes size={24} />
        </div>
        <h1 className="font-bold text-2xl tracking-tight">
          <span className="text-white">Dream</span><span className="text-red-500">Music</span>
        </h1>
      </div>

      <div className="flex flex-col flex-1 justify-between">
        {/* Menu */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</h4>
          <ul className="space-y-2">
            {SIDE_BAR_MENU?.map((menu) => {
              const isActive = (menu.name === "Home" && currentView === "home") || (menu.name === "Library" && currentView === "library");
              return (
                <li
                  key={menu?.name}
                  onClick={() => handleMenuClick(menu.name)}
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all cursor-pointer group ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <div className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${isActive ? "text-red-500" : "group-hover:text-red-500"}`}>
                    {menu?.icon}
                  </div>
                  <span className="font-medium text-sm">{menu?.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* General */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">General</h4>
          <ul className="space-y-2">
            {SIDE_BAR_GENERAL_MENU?.map((menu) => (
              <li
                key={menu?.name}
                className="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="group-hover:text-red-500 transition-colors [&>svg]:w-5 [&>svg]:h-5">
                  {menu?.icon}
                </div>
                <span className="font-medium text-sm">{menu?.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
