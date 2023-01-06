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
