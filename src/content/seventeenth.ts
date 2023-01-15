import { Poly } from '../object/Poly'
import { Sky } from '../object/sky'
import { getGl, getMousePosWebgl, initShader } from '../utils/webgl'

export const seventeenth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return

  //顶点着色器
  const verSourceText = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
                gl_PointSize = 10.0;
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
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  const sky = new Sky(gl)
  let poly: null | Poly = null
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
  // 鼠标按下
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 2) {
      // 结束当前点绘制
      popVertice()
    } else {
      const { x, y } = getMousePosWebgl(e, canvas)
      if (poly) {
        // poly存在则添加点
        poly.addVertices(x, y)
      } else {
        // 创建多边形
        createPoly(x, y)
      }
    }
    // 开始绘制
    render()
  })
  // 鼠标移动监听
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (poly) {
      const { x, y } = getMousePosWebgl(e, canvas)
      // 根据鼠标移动改变最后一个点位
      poly.setVertices(poly.count - 1, x, y)
      render()
    }
  })
  // 创建图形
  const createPoly = (x: number, y: number) => {
    poly = new Poly({
      // 放两个点,一个点放原地，另一个跟随鼠标移动
      vertices: [x, y, x, y],
      types: ['POINTS', 'LINE_STRIP']
    })
    sky.add(poly)
  }
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    sky.draw()
  }
  // 结束当前点的绘制
  const popVertice = () => {
    poly?.popVertices()
    poly = null
  }
}
