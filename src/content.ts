import { Color } from 'three'
import { PointProps } from './type/point'
const getGl = (): [HTMLCanvasElement, WebGLRenderingContext | null] | [] => {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
  if (!canvas) return []
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  const gl = canvas.getContext('webgl')
  return [canvas, gl]
}
const loadShare = (gl: WebGLRenderingContext, type: number, source: string) => {
  const share = gl.createShader(type)
  if (share) {
    gl.shaderSource(share, source)
    gl.compileShader(share)
    return share
  }
  return null
}
const initShader = (
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
// 通过变量绘制点位
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
  initShader(gl, verSource, fsSource)
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  console.log(gl.program)
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}
// 鼠标点击控制点位
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

  initShader(gl, verSource, fsSource)
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
    // 解决原点中心差异 webgl原点处于canvas宽高一半位置处
    const [halfWidth, halfHeight] = [width / 2, height / 2]
    //得到鼠标基于webgl原点的位置
    const [xBaseCenter, yBaseCenter] = [cX - halfWidth, cY - halfHeight]
    // 解决y轴方向差异(webgl y轴与canvas2d y轴方向正好相反)
    const yBaseCenterTop = -yBaseCenter
    // 解决坐标基底(canvas2d以一个像素的宽高作为坐标基底,webgl以半个canvas画布宽高作为坐标基底)
    const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]
    console.log(x, y)
    gl.vertexAttrib2f(a_position, x, y)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, 1)
  })
}
// 鼠标点击添加点位
export const fourth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  const width = canvas.width
  const height = canvas.height
  const pointAry: PointProps[] = [{ x: 0, y: 0 }]
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

  initShader(gl, verSource, fsSource)
  gl.clearColor(0, 0, 0, 1)
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    pointAry.forEach(({ x, y }) => {
      gl.vertexAttrib2f(a_position, x, y)
      gl.drawArrays(gl.POINTS, 0, 1)
    })
  }
  render()

  canvas.addEventListener('click', (e) => {
    const { clientX, clientY } = e
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
    console.log(x, y)
    pointAry.push({x,y})
    render()
  })
}
