import { getGl, initShader } from '../utils/webgl'
import { initColor } from '../utils/color'
// 绘制多个顶点
export const eighth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return

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
        float dist = distance(gl_PointCoord,vec2(0.5,0.5));
        if(dist < 0.5) {
          gl_FragColor = u_FragColor;
        }else {
          discard;
        }
      }  
        `
  initShader(gl, verSourceText, fsSourceText)
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  const a_positSize = gl.getAttribLocation(gl.program!, 'a_positSize')
  const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')
  const vertices = new Float32Array([0.0, 0.1, -0.1, -0.1, 0.1, -0.1])
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
  gl.vertexAttrib1f(a_positSize, 50.0)
  gl.uniform4fv(u_FragColor, [...initColor([0, 122, 204]), 1])
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 3)
}
