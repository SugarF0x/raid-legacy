import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { assetsSlice } from "./assets/assets"

export const store = configureStore({
  reducer: {
    assets: assetsSlice.reducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;