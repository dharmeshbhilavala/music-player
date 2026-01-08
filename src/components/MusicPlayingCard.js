import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Howl } from "howler";
import { fetchTrack, playLocalSong } from "../slice/musicSlice";
import { formatTime } from "../utils/constant";
import { FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaSyncAlt, FaVolumeUp, FaVolumeMute, FaHeart, FaMusic } from "react-icons/fa";

const MusicPlayingCard = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector((state) => state?.music?.nowPlaying);
  const musicList = useSelector((state) => state?.music?.musicList);
  const localMusicList = useSelector((state) => state?.music?.localMusicList);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [sound, setSound] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const rAF = useRef(null);

  // Cleanup function for animation frame
  const cancelRAF = () => {
    if (rAF.current) {
      cancelAnimationFrame(rAF.current);
      rAF.current = null;
    }
  };

  useEffect(() => {
    if (nowPlaying) {
      // 1. Reset State completely on new song
      if (sound) sound.unload();
      cancelRAF();

      setCurrentTime(0);
      setIsPlaying(false);
      setIsSeeking(false);

      // Initialize duration from metadata if available (gives immediate feedback)
      // iTunes API and our local structure both use 'track.duration.totalMilliseconds' mostly, or we map it.
      // fetchMusic maps iTunes 'trackTimeMillis' to duration.totalMilliseconds
      const metaDurationMs = nowPlaying.track?.duration?.totalMilliseconds || nowPlaying.duration?.totalMilliseconds;
      if (metaDurationMs) {
        setDuration(metaDurationMs / 1000);
      } else {
        setDuration(0);
      }

      const src = nowPlaying.preview_url || nowPlaying.uri;
      if (!src) return;

      let newSound = new Howl({
        src: [src],
        html5: true,
        autoplay: true,
        volume: volume,
        format: ['mp3', 'aac', 'wav'],
        onplay: () => {
          setIsPlaying(true);
          requestAnimationFrame(step);
        },
        onend: () => {
          setIsPlaying(false);
          handleNext();
        },
        onload: () => {
          // On load, update with actual audio duration if it differs (e.g. preview vs full metadata)
          // This ensures the seek bar represents correct playable range
          const d = newSound.duration();
          if (d && !isNaN(d)) setDuration(d);
        },
        onpause: () => {
          setIsPlaying(false);
        },
        onstop: () => {
          setIsPlaying(false);
        },
        onseek: () => {
          // Optional: Ensure time synchronizes after seek
          requestAnimationFrame(step);
        },
        onloaderror: (id, err) => {
          console.error("Load error", err);
        }
      });
      setSound(newSound);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying]); // Only re-run if generic track identity changes

  // Handle volume change
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  const step = () => {
    if (sound && sound.playing()) {
      // Only update state if user is NOT currently dragging the slider
      // AND sound is actually playing
      if (!isSeeking) {
        const seek = sound.seek();
        // specific check against Howler returning self when loading
        if (typeof seek === 'number') {
          setCurrentTime(seek);
        }
      }
      rAF.current = requestAnimationFrame(step);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRAF();
      if (sound) sound.unload();
    }
  }, []);

  const playPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
        requestAnimationFrame(step); // Ensure loop restarts
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getActiveList = () => {
    if (nowPlaying?.isLocal) return localMusicList;
    return musicList;
  };

  const handleNext = () => {
    const activeList = getActiveList();
    if (!activeList || activeList.length === 0) return;

    // For local, verify by URI or UID. For API, verify by URI.
    const currentIndex = activeList.findIndex((song) => {
      if (nowPlaying.isLocal) return song.uid === nowPlaying.uid;
      return song?.track?.uri === nowPlaying?.uri || song?.track?.uri?.endsWith(nowPlaying.id);
    });

    const nextIndex = (currentIndex + 1) % activeList.length;
    const nextSong = activeList[nextIndex];

    if (nowPlaying.isLocal) {
      dispatch(playLocalSong(nextSong));
    } else {
      const nextTrackId = nextSong?.track?.uri?.split(":")?.pop();
      dispatch(fetchTrack(nextTrackId));
    }
  };

  const handlePrevious = () => {
    const activeList = getActiveList();
    if (!activeList || activeList.length === 0) return;

    const currentIndex = activeList.findIndex((song) => {
      if (nowPlaying.isLocal) return song.uid === nowPlaying.uid;
      return song?.track?.uri === nowPlaying?.uri || song?.track?.uri?.endsWith(nowPlaying.id);
    });

    const previousIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    const prevSong = activeList[previousIndex];

    if (nowPlaying.isLocal) {
      dispatch(playLocalSong(prevSong));
    } else {
      const previousTrackId = prevSong?.track?.uri?.split(":")?.pop();
      dispatch(fetchTrack(previousTrackId));
    }
  };

  const handleSeekChange = (e) => {
    // Update UI immediately while dragging
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleSeekEnd = (e) => {
    // Apply seek on release
    const newTime = parseFloat(e.target.value);
    if (sound) {
      sound.seek(newTime);
    }
    setIsSeeking(false);
  };

  if (!nowPlaying) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <FaPlay className="pl-1" />
        </div>
        <p>Select a song to play</p>
      </div>
    );
  }

  // Safe checks for UI
  const trackData = nowPlaying.track || nowPlaying; // fallback
  const imageUrl = trackData.album?.images?.[0]?.url;

  const artistName = trackData.artists?.items?.[0]?.profile?.name
    || trackData.artists?.[0]?.name
    || "Unknown Artist";

  const trackName = trackData.name || "Unknown Track";

  return (
    <div className="flex flex-col h-full justify-between pb-4 select-none">
      {/* Album Art */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-6 relative group bg-gray-800 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Now Playing"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
          />
        ) : (
          <FaMusic size={60} className="text-gray-600" />
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <FaHeart className="text-3xl text-red-500 animate-pulse" />
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h2 className="text-xl font-bold text-white leading-tight mb-1 truncate pr-2" title={trackName}>{trackName}</h2>
            <h3 className="text-sm text-gray-400 font-medium truncate">{artistName}</h3>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
            <FaHeart />
          </button>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="w-full group">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onMouseDown={() => setIsSeeking(true)}
            onTouchStart={() => setIsSeeking(true)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all accent-red-500 outline-none focus:outline-none focus:ring-0 active:ring-0"
            style={{ backgroundImage: `linear-gradient(to right, #ef4444 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%)` }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between mt-2">
          <button className="text-gray-400 hover:text-white transition-colors"><FaRandom size={16} /></button>

          <div className="flex items-center gap-4">
            <button onClick={handlePrevious} className="text-gray-300 hover:text-white transition-colors text-2xl">
              <FaStepBackward />
            </button>
            <button
              onClick={playPause}
              className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:bg-red-500 hover:scale-105 transition-all"
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="pl-1" />}
            </button>
            <button onClick={handleNext} className="text-gray-300 hover:text-white transition-colors text-2xl">
              <FaStepForward />
            </button>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors"><FaSyncAlt size={16} /></button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="mt-6 flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-gray-400 hover:text-white">
          {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white outline-none focus:outline-none focus:ring-0 active:ring-0"
          style={{ backgroundImage: `linear-gradient(to right, #ffffff ${volume * 100}%, #4b5563 ${volume * 100}%)` }}
        />
      </div>
    </div>
  );
};

export default MusicPlayingCard;
