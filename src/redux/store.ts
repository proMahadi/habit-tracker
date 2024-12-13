import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./app/habit/habitSlice"

export const store = configureStore({
    reducer: {
        habits: habitReducer,
    },
  });

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.getState;
export type AppDispatch = typeof store.dispatch;
