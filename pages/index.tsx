import type { NextPage } from 'next'
import 'react-circular-progressbar/dist/styles.css';
import { AssetsLoader } from "../components"

const Home: NextPage = () => {

  return (
    <AssetsLoader>
      <div>
        All assets loaded
      </div>
    </AssetsLoader>
  )
}

export default Home
