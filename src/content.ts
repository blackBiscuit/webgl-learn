import { Color } from 'three'
const getGl = (): [HTMLCanvasElement, WebGLRenderingContext | null] | [] => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
  if (!canvas) return []
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  const gl = canvas.getContext('webgl')
  return [canvas, gl]
}
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
export const second = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  //顶点着色器
  //   const verSource = `
  //     void main(){
  //         gl_Position=vec4(0,0,1);
  //         gl_PointSize=50.0;
  //     }
  //     `
  const verSource =
    document.querySelector<HTMLScriptElement>('#vertexShader')!.innerText
  //片元着色器
  //   const fsSource = `
  //     void main(){
  //         gl_FragColor=vec4(1,1,0,1);
  //     }
  //     `
  const fsSource =
    document.querySelector<HTMLScriptElement>('#fragmentShader')!.innerText
  const loadShare = (
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
  const initShader = () => {
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
  initShader()
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  console.log(gl.program)
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}
export const third = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  const width = canvas.width
  const height = canvas.height
  //顶点着色器
  //   const verSource = `
  //     void main(){
  //         gl_Position=vec4(0,0,1);
  //         gl_PointSize=50.0;
  //     }
  //     `
  const verSource =
    document.querySelector<HTMLScriptElement>('#vertexShader')!.innerText
  //片元着色器
  //   const fsSource = `
  //     void main(){
  //         gl_FragColor=vec4(1,1,0,1);
  //     }
  //     `
  const fsSource =
    document.querySelector<HTMLScriptElement>('#fragmentShader')!.innerText
  const loadShare = (
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
  const initShader = () => {
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
  initShader()
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  console.log(gl.program)
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)

  canvas.addEventListener('click', (e) => {
    const { clientX, clientY } = e
    const { left, top } = canvas.getBoundingClientRect()
    const [cX, cY] = [clientX - left, clientY - top]
    console.log(cX, cY)
    // 解决原点中心差异 webgl远点
    const [halfWidth, halfHeight] = [width / 2, height / 2]
  })
}
