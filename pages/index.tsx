import type { NextPage } from 'next'
import Head from 'next/head'
import { useAppDispatch, useAppSelector } from "../hooks"
import { useEffect, useMemo } from "react"
import { initAssets } from "../store/assets/thunks"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './styles.module.css'

const Home: NextPage = () => {
  const dispatch = useAppDispatch()
  const { entries, loadedEntries } = useAppSelector(state => state.assets)

  useEffect(() => {
    dispatch(initAssets())
  }, [])

  const isLoading = useMemo(() => entries !== loadedEntries, [entries, loadedEntries])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isLoading ? (
          <>
            <h1>Loading assets...</h1>
            <CircularProgressbar
              value={loadedEntries || 0}
              minValue={0}
              maxValue={entries || 100}
              text={`${loadedEntries || 0}/${entries || 0}`}
              className={styles.progress}
            />
          </>
        ) : (
          <>
            <h1>All assets loaded!</h1>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
