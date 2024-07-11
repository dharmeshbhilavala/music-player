import { configureStore } from '@reduxjs/toolkit'
import musicSlice from './slice/musicSlice'

export const store = configureStore({
  reducer: {
    music: musicSlice
  },
})