import Compose from '../object/compose'
import Track from '../object/track'
import { PointProps } from '../type/point'
import { initColor } from '../utils/color'
import { loadBgm } from '../utils/remain'
import { getGl, initShader } from '../utils/webgl'

//绘制星星，使用动画使其达到星星眨眼效果
export const seventh = () => {
  document.title = '点击屏幕添加星星'
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  canvas.classList.add('sky-seventh')
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA)
  const width = canvas.width
  const height = canvas.height
  const stars: PointProps[] = []
  const compose = new Compose()
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
  gl.clearColor(0, 0, 0, 0)
  const a_position = gl.getAttribLocation(gl.program!, 'a_position')
  const a_positSize = gl.getAttribLocation(gl.program!, 'a_positSize')
  //获取 uniform变量
  const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')

  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    stars.forEach(({ x, y, size, color, a }) => {
      gl.vertexAttrib2f(a_position, x, y)
      gl.vertexAttrib1f(a_positSize, size)
      const arr = new Float32Array([...Object.values(color), a])
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
    const size = Math.random() * 5 + 2
    const [r, g, b] = initColor([234, 239, 243])
    const color = {
      r,
      g,
      b
    }
    const a = 1
    console.log(color)
    const obj = { x, y, size, color, a }
    stars.push(obj)
    const track = new Track(obj)
    track.start = new Date()
    track.timerLen = 2000
    track.loop = true
    track.keyMap = new Map([
      [
        'a',
        [
          [500, 1],
          [1000, 0],
          [1500, 1]
        ]
      ]
    ])
    compose.add(track)
    loadBgm()
    const ani = () => {
      compose.update(new Date())
      render()
      requestAnimationFrame(ani)
    }
    ani()
  })
}
