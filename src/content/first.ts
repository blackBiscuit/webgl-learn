import { Color } from 'three'
// webgl首次尝试
export const first = () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
  if (!canvas) return
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  const gl = canvas.getContext('webgl')
  if (!gl) return
  gl.clearColor(0, 0, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  const color = new Color('rgba(255, 0, 1)')
  const ani = () => {
    requestAnimationFrame(ani)
    color.offsetHSL(0.005, 0, 0)
    gl.clearColor(color.r, color.g, color.b, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
  //ani()
}
