import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createRequestOptions } from "../utils/helper";

// Async thunk to fetch music list
export const fetchMusic = createAsyncThunk("music/fetchMusic", async () => {
  try {
    const options = createRequestOptions("/album_tracks", {
      id: "3IBcauSj5M2A6lTeffJzdv",
      offset: "0",
      limit: "300",
    });
    const response = await axios.request(options);
    return response?.data?.data?.album?.tracks?.items;
  } catch (error) {
    throw error;
  }
});

// Async thunk to fetch track details
export const fetchTrack = createAsyncThunk("music/fetchTrack", async (trackId) => {
  try {
    const options = createRequestOptions("/tracks/", { ids: trackId });
    const response = await axios.request(options);
    return response?.data?.tracks[0];
  } catch (error) {
    throw error;
  }
});

const initialState = {
  musicList: [],
  status: "idle",
  error: null,
  nowPlaying: null,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    reorderSongs: (state, action) => {
      state.musicList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMusic.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.musicList = action.payload;
      })
      .addCase(fetchMusic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message;
      })
      .addCase(fetchTrack.fulfilled, (state, action) => {
        state.nowPlaying = action.payload;
      })
      .addCase(fetchTrack.rejected, (state, action) => {
        state.error = action.error?.message;
      });
  },
});

export const { reorderSongs } = musicSlice.actions;
export default musicSlice.reducer;
