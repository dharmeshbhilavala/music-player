// src/components/Sidebar.js
import React from "react";

import { IoMusicalNotes } from "react-icons/io5";
import { SIDE_BAR_GENERAL_MENU, SIDE_BAR_MENU } from "../utils/constant";

const Sidebar = () => {
  return (
    <div className="bg-gray-950 text-white h-screen w-1/6 min-w-[240px] flex flex-col p-6 py-6">
      {/* title */}
      <div className="flex items-center gap-2">
        <IoMusicalNotes className="text-red-700 min-w-5 text-3xl" size={44} />
        <h1 className="font-semibold text-3xl">
          <span className="text-red-700">Dream</span>Music
        </h1>
      </div>

      <div className="flex flex-col justify-between h-[100%] my-14">
        {/* menu */}
        <div className="">
          <h4 className="text-xs text-gray-300 uppercase">Menu</h4>
          <ul className="gap-3 flex flex-col mt-2">
            {SIDE_BAR_MENU?.map((menu) => {
              return (
                <li className="flex items-center gap-3 cursor-pointer" key={menu?.name}>
                  {menu?.icon}
                  {menu?.name}
                </li>
              );
            })}
          </ul>
        </div>
        {/* general */}
        <div>
          <h4 className="text-xs text-gray-300 uppercase">general</h4>
          <ul className="gap-3 flex flex-col mt-2">
            {SIDE_BAR_GENERAL_MENU?.map((menu) => {
              return (
                <li className="flex items-center gap-3 cursor-pointer" key={menu?.name}>
                  {menu?.icon}
                  {menu?.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
