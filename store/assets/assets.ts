import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { AssetsMap } from './types'
import { set, get } from 'lodash'

export type AssetsState = Pick<AssetsMap, 'entries'> & AssetsMap['assets'] & {
  loadedEntries: number
};

const initialState: AssetsState = {
  loadedEntries: 0,
  entries: undefined!,
  images: undefined!,
  sounds: undefined!
};

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    initAssets: (state, { payload }: PayloadAction<AssetsMap>) => ({ ...state, entries: payload.entries, ...payload.assets  }),
    setAsset: (state, { payload }: PayloadAction<{ path: string, value: string }>) => {
      const { path, value } = payload
      const nests = path.split('/')
      nests.shift()
      const name = nests.pop()!.split('.')[0]
      const isNumeric = !isNaN(Number(name))
      const storePath = nests.join('.')

      if (!isNumeric) {
        set(state, `${storePath}.${name}`, value)
      } else {
        const isInitial = !get(state, storePath)[0].includes('data:image')
        if (!isInitial) {
          set(state, storePath, [ ...(get(state, storePath) as any), value ])
        } else {
          set(state, storePath, [ value ])
        }
      }
      state.loadedEntries++
    }
  },
});

export const {
  initAssets,
  setAsset
} = assetsSlice.actions;
