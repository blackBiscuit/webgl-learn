import { WebglPointProps } from '../type/point'

export const getGl = ():
  | [HTMLCanvasElement, WebGLRenderingContext | null]
  | [] => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
  if (!canvas) return []
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  const gl = canvas.getContext('webgl')
  return [canvas, gl]
}
export const loadShare = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => {
  const share = gl.createShader(type)
  if (share) {
    gl.shaderSource(share, source)
    gl.compileShader(share)
    return share
  }
  return null
}
export const initShader = (
  gl: WebGLRenderingContext,
  verSource: string,
  fsSource: string
) => {
  const program = gl.createProgram()
  const verShader = loadShare(gl, gl.VERTEX_SHADER, verSource)
  const fsShader = loadShare(gl, gl.FRAGMENT_SHADER, fsSource)
  if (!program || !verShader || !fsShader) return
  gl.attachShader(program, verShader)
  gl.attachShader(program, fsShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  gl.program = program
}
export const getMousePosWebgl = (
  event: MouseEvent,
  canvas: HTMLCanvasElement
) => {
  const { clientX, clientY } = event
  const { width, height } = canvas
  const { left, top } = canvas.getBoundingClientRect()
  const [cX, cY] = [clientX - left, clientY - top]
  // 解决原点中心差异 webgl原点处于canvas宽高一半位置处
  const [halfWidth, halfHeight] = [width / 2, height / 2]
  //得到鼠标基于webgl原点的位置
  const [xBaseCenter, yBaseCenter] = [cX - halfWidth, cY - halfHeight]
  // 解决y轴方向差异(webgl y轴与canvas2d y轴方向正好相反)
  const yBaseCenterTop = -yBaseCenter
  // 解决坐标基底(canvas2d以一个像素的宽高作为坐标基底,webgl以半个canvas画布宽高作为坐标基底)
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]
  return { x, y }
}
export const glToCss = (delta: WebglPointProps, canvas: HTMLCanvasElement) => {
  const { x, y } = delta
  const { width, height } = canvas
  const [halfWidth, halfHeight] = [width / 2, height / 2]
  return {
    x: x * halfWidth,
    y: -y * halfHeight
  }
}
