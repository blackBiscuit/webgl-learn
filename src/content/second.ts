import { getGl, initShader } from '../utils/webgl'
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
