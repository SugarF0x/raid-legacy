import '../styles/globals.css'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app';
import { store } from '../store';
import Head from "next/head"

function MyApp({
  Component, pageProps,
}: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;