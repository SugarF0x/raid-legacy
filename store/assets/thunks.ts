import { createAsyncThunk } from "@reduxjs/toolkit"
import { AssetsState, initAssets as initAssetsReducer, setAsset } from "./assets"
import { each } from 'lodash'

async function urlContentToDataUri(url: string) {
  return await fetch(url).then(response => response.blob()).then(blob => new Promise(callback => {
    let reader = new FileReader()
    reader.onload = function () { callback(this.result) }
    reader.readAsDataURL(blob)
  }))
}

export const initAssets = createAsyncThunk(
  'assets/initAssets',
  async (payload, { dispatch, getState }) => {
    const state = (getState() as any).assets as AssetsState
    if (state.entries > 0) return

    fetch('/_next/static/assetsMap.json')
      .then(response => response.json())
      .then(json => { dispatch(initAssetsReducer(json)) })
      .then(() => { dispatch(loadAssets()) })
  }
)

export const loadAssets = createAsyncThunk(
  'assets/loadAssets',
  async (payload, { dispatch, getState }) => {
    const state = (getState() as any).assets as AssetsState

    async function fetchEach(obj: Record<string, any>) {
      await each(obj, async (path: any) => {
        if (typeof path === 'object') {
          fetchEach(path)
        } else {
          const value = await urlContentToDataUri(path) as string
          dispatch(setAsset({ path, value }))
        }
      })
    }

    await fetchEach(state.images!)
    await fetchEach(state.sounds!)
  }
)