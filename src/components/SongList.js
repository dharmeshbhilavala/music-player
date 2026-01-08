import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { fetchTrack, reorderSongs, addLocalSongs, playLocalSong } from "../slice/musicSlice";
import { FaClock, FaPlay, FaGripLines, FaFileUpload } from "react-icons/fa";
import { BiBarChart, BiMusic } from "react-icons/bi";

const SongList = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const nowPlaying = useSelector((state) => state.music?.nowPlaying);
  const musicList = useSelector((state) => state.music?.musicList);
  const localMusicList = useSelector((state) => state.music?.localMusicList);
  const currentView = useSelector((state) => state.music?.currentView);

  useEffect(() => {
    if (!nowPlaying && musicList?.length > 0 && currentView === 'home') {
      handleSongClick(musicList[0]);
    }
  }, [nowPlaying, musicList, currentView]);

  const handleSongClick = async (song) => {
    // For both local and iTunes songs, we now have the full object with preview_url
    // so we can just set it as playing directly.
    // The structure is unified in the slice.
    dispatch(playLocalSong(song));
  };

  const handleOnDragEnd = (result) => {
    if (!result?.destination || currentView !== 'home') return;

    const reorderedSongs = Array.from(musicList);
    const [reorderedItem] = reorderedSongs.splice(result.source.index, 1);
    reorderedSongs.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderSongs(reorderedSongs));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newTracks = files.map((file) => ({
      uid: 'local-' + Date.now() + Math.random(),
      isLocal: true,
      name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
      // Create object URL for playback
      preview_url: URL.createObjectURL(file), // This is a string, safe for serializable state in this context, though purely strictly maybe frowned upon for long term persistence, but fine here
      uri: 'local:' + Date.now() + Math.random(),
      track: {
        name: file.name.replace(/\.[^/.]+$/, ""),
        duration: { totalMilliseconds: 0 }, // We don't know duration until load
        artists: { items: [{ profile: { name: "Local Artist" } }] },
        album: { images: [], name: "Local Uploads" }
      },
      // Flat structure for easier usage if needed, but keeping track structure helps compatibility
      artist: "Local Artist",
    }));

    dispatch(addLocalSongs(newTracks));
  };

  const formatDuration = (ms) => {
    if (!ms) return "-:--";
    return new Date(ms).toISOString().substr(14, 5);
  };

  const currentList = currentView === 'home' ? musicList : localMusicList;

  return (
    <div className="text-white rounded-lg">
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {currentView === 'home' ? 'Popular Songs' : 'My Library'}
        </h2>

        <div className="flex gap-4">
          {currentView === 'library' && (
            <>
              <input
                type="file"
                multiple
                accept="audio/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-md shadow-red-500/20"
              >
                <FaFileUpload /> Upload Songs
              </button>
            </>
          )}
          {currentView === 'home' && (
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">See All</button>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        {currentList?.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <BiMusic size={48} className="mb-4 opacity-20" />
            <p>{currentView === 'library' ? "No local songs added yet." : "No music available."}</p>
            {currentView === 'library' && <p className="text-sm mt-2">Click upload to add files from your PC.</p>}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="songs" isDropDisabled={currentView !== 'home'}>
              {(provided) => (
                <table className="w-full text-left" {...provided.droppableProps} ref={provided.innerRef}>
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 pl-4 w-12">#</th>
                      <th className="py-4">Title</th>
                      <th className="py-4">Album</th>
                      <th className="py-4">Plays</th>
                      <th className="py-4 pr-4 text-right"><FaClock className="inline" /></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-300">
                    {currentList?.map((song, index) => {
                      const trackDetails = song.track || song;
                      const trackUri = song.isLocal ? song.uri : (song?.track?.uri?.split(":")?.pop() || song.uri);
                      const isPlaying = nowPlaying ? (nowPlaying.isLocal ? nowPlaying.uri === song.uri : nowPlaying.id === trackUri || nowPlaying.uid === song.uid) : false;

                      return (
                        <Draggable key={song?.uid} draggableId={song?.uid} index={index} isDragDisabled={currentView !== 'home'}>
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              onClick={() => handleSongClick(song)}
                              className={`
                                group hover:bg-white/5 transition-colors cursor-pointer rounded-lg border-b border-transparent
                                ${isPlaying ? "text-red-500 bg-white/5" : ""}
                                ${snapshot.isDragging ? "bg-gray-800 shadow-xl" : ""}
                            `}
                            >
                              <td className="py-3 pl-4 rounded-l-lg" {...provided.dragHandleProps}>
                                <div className="flex items-center justify-center w-6 h-6">
                                  {isPlaying ? (
                                    <BiBarChart className="animate-pulse" size={16} />
                                  ) : (
                                    <span className="group-hover:hidden font-mono text-gray-500">{index + 1}</span>
                                  )}
                                  {!isPlaying && (
                                    <FaPlay size={10} className="hidden group-hover:block ml-0.5 text-white" />
                                  )}
                                </div>
                              </td>
                              <td className="py-3 font-medium text-white flex items-center gap-3">
                                {trackDetails?.album?.images && trackDetails.album.images.length > 0 ? (
                                  <img
                                    src={trackDetails.album.images[0]?.url}
                                    alt=""
                                    className="w-10 h-10 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center">
                                    <BiMusic className="text-gray-500" />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className={isPlaying ? "text-red-500" : "text-white"}>{trackDetails?.name || song.name}</span>
                                  <span className="text-gray-500 text-xs">{
                                    trackDetails?.artists?.items?.[0]?.profile?.name ||
                                    trackDetails?.artists?.[0]?.name ||
                                    "Unknown"
                                  }</span>
                                </div>
                              </td>
                              <td className="py-3 text-gray-500 max-w-[150px] truncate">
                                {trackDetails?.album?.name}
                              </td>
                              <td className="py-3 text-gray-500 font-mono text-xs">
                                {song.isLocal ? '-' : (trackDetails?.playcount?.toLocaleString() || '-')}
                              </td>
                              <td className="py-3 pr-4 text-right rounded-r-lg font-mono text-xs">
                                {formatDuration(trackDetails?.duration?.totalMilliseconds)}
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default SongList;
