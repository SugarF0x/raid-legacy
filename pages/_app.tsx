import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { store } from '../store';
import { useEffect } from "react"
import { useAppDispatch } from "../hooks"

function MyApp({
  Component, pageProps,
}: AppProps) {
  // const dispatch = useAppDispatch()
  //
  // useEffect(() => {
  //
  // }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;