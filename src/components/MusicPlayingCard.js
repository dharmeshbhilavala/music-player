import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Howl } from "howler";
import { fetchTrack } from "../slice/musicSlice";
import { formatTime } from "../utils/constant";
import { FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaSyncAlt } from "react-icons/fa";

const MusicPlayingCard = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector((state) => state?.music?.nowPlaying);
  const musicList = useSelector((state) => state?.music?.musicList);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (nowPlaying && nowPlaying?.preview_url) {
      if (sound) {
        sound.unload();
      }
      let newSound = new Howl({
        src: [nowPlaying?.preview_url],
        html5: true,
        autoplay: true,
        volume: 0.5,
        onplay: () => {
          requestAnimationFrame(step);
        },
        onend: () => {
          setIsPlaying(false);
        },
        onload: () => {
          setDuration(newSound?.duration());
        },
      });
      setSound(newSound);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [nowPlaying]);

  const playPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const step = () => {
    if (sound) {
      const seek = sound?.seek();
      setCurrentTime(seek);
      if (sound.playing()) {
        requestAnimationFrame(step);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = musicList?.findIndex((song) => song?.track?.uri === nowPlaying?.uri);
    const nextIndex = (currentIndex + 1) % musicList?.length;
    const nextTrackId = musicList[nextIndex]?.track?.uri?.split(":")?.pop();
    dispatch(fetchTrack(nextTrackId));
  };

  const handlePrevious = () => {
    const currentIndex = musicList?.findIndex((song) => song?.track?.uri === nowPlaying?.uri);
    const previousIndex = (currentIndex - 1 + musicList?.length) % musicList?.length;
    const previousTrackId = musicList[previousIndex]?.track?.uri?.split(":")?.pop();
    dispatch(fetchTrack(previousTrackId));
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e?.target?.value);
    if (sound) {
      sound.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="bg-red-900 text-white p-4 rounded-lg shadow-md w-64 h-fit">
      <div className="text-center text-sm mb-4">Now Playing</div>
      {nowPlaying ? (
        <>
          <div className="mb-4 flex flex-col justify-center items-center">
            <img
              src={nowPlaying?.album?.images[0]?.url}
              alt="Now Playing"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-xl font-bold">{nowPlaying?.name}</div>
            <div className="text-sm">{nowPlaying?.artists[0]?.name}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onInput={handleSeek}
              className="flex-1 mx-2"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <button className="focus:outline-none">
              <FaRandom />
            </button>
            <button onClick={handlePrevious} className="focus:outline-none">
              <FaStepBackward />
            </button>
            <button onClick={playPause} className="bg-red-800 p-2 rounded-full focus:outline-none">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleNext} className="focus:outline-none">
              <FaStepForward />
            </button>
            <button className="focus:outline-none">
              <FaSyncAlt />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">No item</div>
      )}
    </div>
  );
};

export default MusicPlayingCard;
