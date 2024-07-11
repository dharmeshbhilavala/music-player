import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { fetchTrack, reorderSongs } from "../slice/musicSlice";
import { SONG_LIST_TABLE_HEADER } from "../utils/constant";

const SongList = () => {
  const dispatch = useDispatch();
  const nowPlaying = useSelector((state) => state.music?.nowPlaying);
  const musicList = useSelector((state) => state.music?.musicList);

  useEffect(() => {
    if (!nowPlaying) {
      handleSongClick(musicList?.[0]);
    }
  }, [nowPlaying, musicList]);

  const handleSongClick = async (song) => {
    const trackId = song?.track?.uri?.split(":")?.pop();
    dispatch(fetchTrack(trackId));
  };

  const handleOnDragEnd = (result) => {
    if (!result?.destination) return;

    const reorderedSongs = Array?.from(musicList);
    const [reorderedItem] = reorderedSongs?.splice(result?.source?.index, 1);
    reorderedSongs?.splice(result?.destination?.index, 0, reorderedItem);
    dispatch(reorderSongs(reorderedSongs));
  };

  return (
    <div className="p-4 text-white rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Popular</h2>
        <button className="text-sm text-gray-400 hover:text-gray-200">See All</button>
      </div>
      <div className="overflow-y-auto max-h-[30vh] no-scrollbar">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="songs">
            {(provided) => (
              <table className="min-w-full bg-transparent" {...provided?.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr className="border-b border-gray-700">
                    {SONG_LIST_TABLE_HEADER?.map((header) => {
                      return (
                        <th className="py-3 text-left" key={header}>
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {musicList?.map((song, index) => (
                    <Draggable key={song?.uid} draggableId={song?.uid} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided?.innerRef}
                          {...provided?.draggableProps}
                          {...provided?.dragHandleProps}
                          className={`border-b border-gray-700 ${
                            song?.track?.uri?.split(":")?.pop() === nowPlaying?.id ? "bg-red-700" : "hover:bg-red-900"
                          }`}
                          onClick={() => handleSongClick(song)}
                        >
                          <td className="py-3">{index + 1}</td>
                          <td className="py-3">{song?.track?.name}</td>
                          <td className="py-3">{song?.track?.playcount}</td>
                          <td className="py-3">
                            {new Date(song?.track?.duration?.totalMilliseconds)?.toISOString().substr(14, 5)}
                          </td>
                          <td className="py-3">{song?.track?.artists?.items?.[0]?.profile?.name}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided?.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default SongList;
