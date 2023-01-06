import { getGl, initShader } from '../utils/webgl'
import { initColor } from '../utils/color'
// 绘制三角形 (三角扇)
export const twelfth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return

  //顶点着色器
  const verSourceText = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
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
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')

  const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')
  /**
   * 三角扇绘制
   * 首先从 v0 > v1 > v2
   * 然后  v0 > v2 > v3
   * v0 > v3 > v4
   * v0 > v4 > v5
   *  
   */
  const vertices = new Float32Array([
    0.0, 0.1, 0.1, -0.1, 0.2, 0.1, 0.3, -0.1, 0.4, 0.1, 0.5, -0.1
  ])
  // 创建缓冲区
  const vertexBuffer = gl.createBuffer()
  // 绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  // 修改 attr变量
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)
  // 赋能批处理功能
  gl.enableVertexAttribArray(a_position)
  gl.uniform4fv(u_FragColor, [...initColor([191, 48, 255]), 1])
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 绘制方式改为gl.TRIANGLE_FAN
  // 第三个参数 在某些绘制方式里面第三个参数的数字大于实际给的坐标点数时，就会以webgl的中心点作为默认填充
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)
}
