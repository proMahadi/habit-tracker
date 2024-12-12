import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./app/habit/habitSlice"

export const store = configureStore({
    reducer: {
        habits: habitReducer,
    },
  })