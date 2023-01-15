import { getGl, initShader } from '../utils/webgl'
import { Poly } from '../object/Poly'
import { getMousePosWebgl } from '../utils/webgl'
// 异步绘制
export const sixteenth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return

  //顶点着色器
  const verSourceText = `
          attribute vec4 a_position;
          void main() {
              gl_Position = a_position;
              gl_PointSize = 30.0;
          }
            `
  //片元着色器
  const fsSourceText = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
    float dist = distance(gl_PointCoord,vec2(0.5,0.5));
    if(dist < 0.5) {
      gl_FragColor = u_FragColor;
    }else {
      discard;
    }
  } 
            `
  initShader(gl, verSourceText, fsSourceText)
  const poly = new Poly({
    gl,
    types: ['POINTS', 'LINE_STRIP']
  })
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getMousePosWebgl(e, canvas)
    poly.addVertices(x, y)
    gl.clear(gl.COLOR_BUFFER_BIT)
    poly.draw()
  })
}
