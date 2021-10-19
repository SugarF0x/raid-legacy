import { Layer, Stage, Rect, Image as Img } from "react-konva"
import styles from '../../styles/Game.module.css'
import { useCallback, useEffect, useState } from "react"
import { KONVA } from '../../consts'
import { debounce } from "lodash"
import { useAppSelector } from "../../hooks"

export function Game() {
  const { images } = useAppSelector(state => state.assets)
  const image = new Image()
  image.src = images.tiles.coins[0]

  const [konvaConfig, setKonvaConfig] = useState({
    width: KONVA.WIDTH,
    height: KONVA.HEIGHT,
    scaleX: 1,
    scaleY: 1,
  })

  const resize = useCallback(() => {
    const konvaElement = document.querySelector('#konva')
    if (!konvaElement) return

    const konvajs = document.querySelector('.konvajs-content')
    if (!konvajs) return

    const style = window.getComputedStyle(konvaElement, null)
    if (!style) return

    const styleHeight = style.getPropertyValue("height")
    const styleWidth = style.getPropertyValue("width")
    const wrapperHeight = parseInt(styleHeight.slice(0, styleHeight.length - 2))
    const wrapperWidth = parseInt(styleWidth.slice(0, styleWidth.length - 2))
    if (!wrapperHeight || !wrapperWidth) return

    let width = KONVA.WIDTH
    let height = KONVA.HEIGHT
    let scaleX
    let scaleY
    if (wrapperWidth / width > wrapperHeight / height) {
      scaleY = wrapperHeight / height
      scaleX = wrapperHeight / height
      height = wrapperHeight
      width = wrapperHeight * 0.5625
    } else {
      scaleY = wrapperWidth / width
      scaleX = wrapperWidth / width
      width = wrapperWidth
      height = wrapperWidth / 9 * 16
    }
    setKonvaConfig({
      width,
      height,
      scaleX,
      scaleY
    })

    const newStyle = `width: ${width}px; height: ${height}px`
    konvajs.setAttribute('style', newStyle)
  }, [])

  const debouncedResize = useCallback(debounce(resize, 50), [resize])

  useEffect(() => {
    resize()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
    }
  }, [debouncedResize])

  return (
    <div className={styles.wrapper} id='konva'>
      <Stage {...konvaConfig}>
        <Layer >
          <Rect width={450} height={800} fill={'white'} />
          <Rect x={1} y={1} width={448} height={798} fill={'black'}/>
          <Img x={10} y={10} width={50} height={50} image={image} />
        </Layer>
      </Stage>
    </div>
  )
}

export default Game