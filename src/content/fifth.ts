import { PointSixProps } from '../type/point'
import { getGl, initShader } from '../utils/webgl'
// 鼠标点击添加随机大小和颜色的点位
export const fifth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  const width = canvas.width
  const height = canvas.height
  const pointAry: PointSixProps[] = [
    {
      x: 0,
      y: 0,
      size: 100,
      color: {
        r: 1,
        g: 1,
        b: 0,
        a: 1
      }
    }
  ]
  //顶点着色器
  const verSourceText = `
      attribute vec4 a_position;
      attribute float a_positSize;
      void main() {
          gl_Position = a_position;
          gl_PointSize = a_positSize;
      }
        `
  //片元着色器
  const fsSourceText = `
      precision mediump float;
      uniform vec4 u_FragColor;
      void main(){
        gl_FragColor = u_FragColor;
      }  
        `
  initShader(gl, verSourceText, fsSourceText)
  gl.clearColor(0, 0, 0, 1)
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  const a_positSize = gl.getAttribLocation(gl.program!, 'a_positSize')
  //获取 uniform变量
  const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')

  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    pointAry.forEach(({ x, y, size, color }) => {
      // const { r, g, b, a } = color
      gl.vertexAttrib2f(a_position, x, y)
      gl.vertexAttrib1f(a_positSize, size)
      // 第一种渲染颜色 uniform4f
      // gl.uniform4f(u_FragColor, r, g, b, a)
      // 第二种渲染颜色 uniform4fv
      const arr = new Float32Array(Object.values(color))
      gl.uniform4fv(u_FragColor, arr)
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
    const size = Math.random() * 50 + 10
    const color = {
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      a: 1
    }
    pointAry.push({ x, y, size, color })
    render()
  })
}
