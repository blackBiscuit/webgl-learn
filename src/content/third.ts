import { getGl, initShader } from '../utils/webgl'
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
