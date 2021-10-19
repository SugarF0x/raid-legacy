import { useAppDispatch, useAppSelector } from "../hooks"
import { ReactNode, useEffect, useMemo } from "react"
import { initAssets } from "../store/assets/thunks"
import styles from "../styles/AssetsLoader.module.css"
import { CircularProgressbar } from "react-circular-progressbar"

export function AssetsLoader(props: { children: ReactNode }) {
  const { children } = props
  const dispatch = useAppDispatch()
  const { entries, loadedEntries } = useAppSelector(state => state.assets)

  useEffect(() => {
    if (entries !== loadedEntries) {
      dispatch(initAssets())
    }
  }, [])

  const isLoading = useMemo(() => entries !== loadedEntries, [entries, loadedEntries])

  return (
    <>
      {isLoading ? (
        <div className={styles.wrapper}>
          <CircularProgressbar
            value={loadedEntries || 0}
            minValue={0}
            maxValue={entries || 100}
            text={`${loadedEntries || 0}/${entries || 0}`}
            className={styles.progress}
          />
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}

export default AssetsLoader