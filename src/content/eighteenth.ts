import { getGl, getMousePosWebgl, initShader, glToCss } from '../utils/webgl'
import { Poly } from '../object/Poly'
import { Sky } from '../object/sky'
import Track from '../object/track'
import Compose from '../object/compose'
interface PointProps {
  x: number
  y: number
  pointSize: number
  alpha: number
}
export const eighteenth = () => {
  const [canvas, gl] = getGl()
  if (!gl || !canvas) return
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA)
  canvas.classList.add('sky-eighteenth')
  //顶点着色器
  const verSourceText = `
              attribute vec4 a_attr;
              varying float v_Alpha;
              void main() {
                  gl_Position = vec4(a_attr.x,a_attr.y,0.0,1.0);
                  gl_PointSize = a_attr.z;
                  v_Alpha=a_attr.w;
              }
                `
  //片元着色器
  const fsSourceText = `
      precision mediump float;
      varying float v_Alpha; 
      void main(){
        float dist = distance(gl_PointCoord,vec2(0.5,0.5));
        if(dist < 0.5) {
          gl_FragColor=vec4(0.87,0.91,1,v_Alpha);
        }else {
          discard;
        }
      } 
                `
  initShader(gl, verSourceText, fsSourceText)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const sky = new Sky<PointProps>(gl)
  const compose = new Compose()
  let poly: null | Poly<PointProps> = null
  // 储存鼠标移动时，webgl上已有的点，没有则为null
  let point: null | PointProps = null
  // 禁用鼠标右键默认事件
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
  //鼠标按下
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 2) {
      // 结束当前点绘制
      popVertices()
    } else {
      const { x, y } = getMousePosWebgl(e, canvas)
      if (poly) {
        // poly存在则添加点
        addVertices(x, y)
      } else {
        // 创建多边形
        createPoly(x, y)
      }
    }
    // 开始绘制
    render()
  })
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const { x, y } = getMousePosWebgl(e, canvas)
    point = hoverPoint(x, y)
    canvas.style.cursor = point ? 'pointer' : 'default'
    if (poly) {
      const obj = poly.geoData[poly.geoData.length - 1]
      obj.x = x
      obj.y = y
    }
  })
  const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT)
    sky.draw()
  }
  const createPoly = (x: number, y: number) => {
    let o1 = point ? point : { x, y, pointSize: random(), alpha: 1 }
    const o2 = { x, y, pointSize: random(), alpha: 1 }
    poly = new Poly<PointProps>({
      // 放两个点,一个点放原地，另一个跟随鼠标移动
      attrName: 'a_attr',
      geoData: [o1, o2],
      types: ['POINTS', 'LINE_STRIP'],
      color: [232, 233, 236]
    })
    sky.add(poly)
    createTrack(o1)
    createTrack(o2)
  }
  // 创建 Track 
  const createTrack = (o: PointProps) => {
    const { pointSize } = o
    const track = new Track(o)
    track.start = new Date()
    track.timerLen = 2000
    track.loop = true
    track.keyMap = new Map([
      [
        'pointSize',
        [
          [500, pointSize],
          [1000, 0],
          [1500, pointSize]
        ]
      ],
      [
        'alpha',
        [
          [500, 1],
          [1000, 0],
          [1500, 1]
        ]
      ]
    ])
    compose.add(track)
  }
  // 结束当前点的绘制,出栈和鼠标绑定的点
  const popVertices = () => {
    poly?.geoData.pop()
    compose.children.pop()
    poly = null
  }
  // 添加新点
  const addVertices = (x: number, y: number) => {
    if (!poly) return
    const { geoData } = poly
    if (point) {
      geoData[geoData.length - 1] = point
    }
    const o = { x, y, pointSize: random(), alpha: 1 }
    geoData.push(o)
    createTrack(o)
  }
  // 判断是否有重叠的点
  const hoverPoint = (mx: number, my: number) => {
    for (let { geoData } of sky.children) {
      for (let p of geoData) {
        if (poly && poly.geoData[poly.geoData.length - 1] === p) {
          continue
        }
        const delta = {
          x: mx - p.x,
          y: my - p.y
        }
        const { x, y } = glToCss(delta, canvas)
        const dist = x ** 2 + y ** 2
        if (Math.sqrt(dist) < 10) {
          return p
        }
      }
    }
    return null
  }

  const random = () => Math.random() * 8 + 3
  const start = () => {
    requestAnimationFrame(start)
    compose.update(new Date())
    // 添加需要转换的属性
    sky.updateVertices(['x', 'y', 'pointSize', 'alpha'])
    render()
  }
  start()
}
