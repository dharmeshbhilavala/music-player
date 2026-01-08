//  constant.js

import { IoMdTrendingUp } from "react-icons/io";
import { BiSolidMusic } from "react-icons/bi";
import { AiFillHome, AiFillCompass, AiFillSetting } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

export const SIDE_BAR_MENU = [
  {
    icon: <AiFillHome size={20} />,
    name: "Home",
  },
  {
    icon: <IoMdTrendingUp size={20} />,
    name: "Trends",
  },
  {
    icon: <BiSolidMusic size={20} />,
    name: "Library",
  },
  {
    icon: <AiFillCompass size={20} />,
    name: "Discover",
  },
];

export const SIDE_BAR_GENERAL_MENU = [
  {
    icon: <AiFillSetting size={20} />,
    name: "Settings",
  },
  {
    icon: <MdLogout size={20} />,
    name: "Log Out",
  },
];

export const SONG_LIST_TABLE_HEADER = ["#", "Title", "Playing", "Time", "Album"];

export const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
