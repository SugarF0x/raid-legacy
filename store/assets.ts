import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '.';
import { AssetsMap } from '../types'

export type AssetsState = Pick<AssetsMap, 'entries'> & AssetsMap['assets'] & {

};

const initialState: AssetsState = {

};

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    
  },
});

export const {
} = assetsSlice.actions;
