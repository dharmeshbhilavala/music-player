import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createRequestOptions } from "../utils/helper";

// Async thunk to fetch music list (Using iTunes Search API)
export const fetchMusic = createAsyncThunk("music/fetchMusic", async (term = "top 100") => {
  try {
    const response = await axios.get(`https://itunes.apple.com/search?term=${term}&entity=song&limit=50`);
    // Map iTunes structure to match our app's internal "track" structure expectation
    // iTunes returns: { results: [ { trackName, artistName, previewUrl, artworkUrl100, ... } ] }
    return response.data.results.map(item => ({
      uid: item.trackId.toString(),
      isLocal: false,
      name: item.trackName,
      uri: item.previewUrl, // We use previewUrl as the URI for playback
      id: item.trackId.toString(),
      track: {
        name: item.trackName,
        uri: "spotify:track:" + item.trackId, // Fake URI for compatibility
        id: item.trackId.toString(),
        duration: { totalMilliseconds: item.trackTimeMillis },
        playcount: item.trackCount || 1000,
        preview_url: item.previewUrl,
        artists: { items: [{ profile: { name: item.artistName } }] },
        album: {
          name: item.collectionName,
          images: [{ url: item.artworkUrl100?.replace('100x100', '600x600') }] // Upscale image if possible
        }
      }
    }));
  } catch (error) {
    throw error;
  }
});

// Async thunk to fetch track details (No longer needed separately for iTunes as we get all data, but kept for compatibility)
export const fetchTrack = createAsyncThunk("music/fetchTrack", async (trackId) => {
  // For iTunes, we just pass the full song object usually, but if we need to fetch specifically:
  // This strictly isn't needed if we hydrate everything from fetchMusic, but let's emulate it
  // by returning the track from the state in the component, or just returning the ID if we already have it.
  // However, to keep it simple, we will assume the CLICK event passes the full song object now.
  return null;
});

const initialState = {
  musicList: [],
  localMusicList: [],
  status: "idle",
  currentView: "home", // 'home' | 'library'
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
    setView: (state, action) => {
      state.currentView = action.payload;
    },
    addLocalSongs: (state, action) => {
      // action.payload should be array of formatted track objects
      state.localMusicList = [...state.localMusicList, ...action.payload];
    },
    playLocalSong: (state, action) => {
      state.nowPlaying = action.payload;
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

export const { reorderSongs, setView, addLocalSongs, playLocalSong } = musicSlice.actions;
export default musicSlice.reducer;
