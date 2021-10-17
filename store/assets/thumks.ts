import { createAsyncThunk } from "@reduxjs/toolkit"

function urlContentToDataUri(url: string) {
  return fetch(url).then(response => response.blob()).then(blob => new Promise(callback => {
    let reader = new FileReader()
    reader.onload = function () { callback(this.result) }
    reader.readAsDataURL(blob)
  }))
}

export {}