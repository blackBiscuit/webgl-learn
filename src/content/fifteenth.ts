import { getGl, initShader } from '../utils/webgl'
import { Poly } from '../object/Poly'

// 异步绘制
export const fifteenth = () => {
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
      void main() {
        gl_FragColor = u_FragColor;
      } 
            `
  initShader(gl, verSourceText, fsSourceText)
  const poly = new Poly({
    gl,
    vertices: [0, 0.2]
  })
  console.log(poly)
  poly.draw()
  setTimeout(() => {
    poly.addVertices(-0.2, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    poly.draw()
  }, 1000)
  setTimeout(() => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 绘制方式改为gl.TRIANGLE_STRIP
    // gl.drawArrays(gl.POINTS, 0, 2)
    // gl.drawArrays(gl.LINES, 0, 2)
    poly.draw(['POINTS', 'LINES'])
  }, 2000)
  // canvas.addEventListener('mousedown', (e) => {
  //   const { x, y } = getMousePosInwebgl(e, canvas)
  //   poly.addVertice(x, y)
  //   gl.clear(gl.COLOR_BUFFER_BIT)
  //   poly.draw(['POINTS', 'LINES'])
  // })
  //   const a_position = gl.getAttribLocation(gl.program!, 'a_position')

  //   const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')
  //   const vertices = [0, 0.2]
  //   // 创建缓冲区
  //   const vertexBuffer = gl.createBuffer()
  //   // 绑定缓冲区
  //   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  //   // 缓冲区写入数据
  //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  //   // 修改 attr变量
  //   gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  //   // 赋能批处理功能
  //   gl.enableVertexAttribArray(a_position)
  //   gl.uniform4fv(u_FragColor, [...initColor([191, 48, 255]), 1])
  //   gl.clearColor(0, 0, 0, 1)
  //   gl.clear(gl.COLOR_BUFFER_BIT)
  //   // 绘制方式改为gl.TRIANGLE_STRIP
  //   gl.drawArrays(gl.POINTS, 0, 1)
  //   setTimeout(() => {
  //     vertices.push(-0.2, 0)
  //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  //     gl.clear(gl.COLOR_BUFFER_BIT)
  //     // 绘制方式改为gl.TRIANGLE_STRIP
  //     gl.drawArrays(gl.POINTS, 0, 2)
  //   }, 1000)
  //   setTimeout(() => {
  //     gl.clear(gl.COLOR_BUFFER_BIT)
  //     // 绘制方式改为gl.TRIANGLE_STRIP
  //     gl.drawArrays(gl.POINTS, 0, 2)
  //     gl.drawArrays(gl.LINES, 0, 2)
  //   }, 2000)
}
