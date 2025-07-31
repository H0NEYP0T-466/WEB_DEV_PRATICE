import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../Features/Slice/Counter'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})