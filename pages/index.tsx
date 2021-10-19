import type { NextPage } from 'next'
import 'react-circular-progressbar/dist/styles.css';
import dynamic from "next/dynamic"

const AssetsLoader = dynamic(() => import('../components/AssetsLoader'), { ssr: false })
const Game = dynamic(() => import('../components/Game'), { ssr: false })

const Home: NextPage = () => {
  return (
    <AssetsLoader>
      <Game />
    </AssetsLoader>
  )
}

export default Home
