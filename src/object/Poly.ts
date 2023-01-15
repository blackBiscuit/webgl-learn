import { initColor, Colors } from '../utils/color'

interface AttrProps<T extends Record<string, any> = Record<string, any>> {
  gl: null | WebGLRenderingContext
  vertices: number[]
  geoData: T[]
  size: number
  count: number
  attrName: string
  types: string[]
  color: Colors
}
const defAttr = (): AttrProps => ({
  gl: null,
  vertices: [],
  geoData: [],
  size: 2,
  count: 0,
  attrName: 'a_position',
  types: ['POINTS'],
  color: [191, 48, 255]
})
const initSize = (obj: Record<any, any>) => Object.keys(obj).length

export class Poly<T extends Record<string, any> = Record<string, any>,K extends keyof T = keyof T> {
  gl!: null | WebGLRenderingContext
  geoData!: T[]
  size!: number
  count!: number
  attrName!: string
  types!: string[]
  color!: Colors
  private _vertices!: number[]
  constructor(attr: Partial<AttrProps<T>> = {}) {
    
    Object.assign(this, defAttr(), attr)
    if (!attr.size  && attr.geoData?.length) {
      this.size = initSize(attr.geoData[0])
    }
    this.color = initColor(this.color)

    const { gl } = this
    if (gl) {
      this.init()
    }
  }
  set vertices(value: number[]) {
    this._vertices = value
    this.updateCount()
  }
  get vertices() {
    return this._vertices
  }
  updateCount() {
    this.count = this.vertices.length / this.size
  }
  updateBuffer() {
    const { gl, vertices } = this
    if (!gl) return
    this.updateCount()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  }
  addVertices(...params: any) {
    const newVertices = [...this.vertices]
    newVertices.push(...params)
    this.vertices = newVertices
    this.updateBuffer()
  }
  popVertices() {
    const { vertices, size } = this
    const len = vertices.length
    const newVertices = [...this.vertices]
    newVertices.splice(len - size, len)
    this.vertices = newVertices
  }
  setVertices(ind: number, ...params: any[]) {
    const newVertices = [...this.vertices]
    const i = ind * this.size
    params.forEach((param, index) => {
      newVertices[i + index] = param
    })
    this.vertices = newVertices
  }
  updateVertices(params: K[]) {
    const { geoData } = this
    const vertices: number[] = []
    geoData.forEach((data: any) => {
      params.forEach((key: K) => {
        vertices.push(data[key])
      })
    })
    this.vertices = vertices
  }
  draw(types = this.types) {
    const { gl, count } = this
    if (!gl) return
    for (let _type of types) {
      const typeKey = _type as keyof WebGLRenderingContext
      const currentType = gl[typeKey] as number
      gl.drawArrays(currentType, 0, count)
    }
  }
  init() {
    const { gl, size, attrName, color } = this
    if (!gl) return
    const a_position = gl.getAttribLocation(gl.program!, attrName)
   // const u_FragColor = gl.getUniformLocation(gl.program!, 'u_FragColor')
    // 创建缓冲区
    const vertexBuffer = gl.createBuffer()
    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 缓冲区写入数据
    this.updateBuffer()
    // 修改 attr变量
    gl.vertexAttribPointer(a_position, size, gl.FLOAT, false, 0, 0)
    // 赋能批处理功能
    gl.enableVertexAttribArray(a_position)
   // gl.uniform4fv(u_FragColor, [...color, 1])
    // gl.clearColor(0, 0, 0, 1)
    // gl.clear(gl.COLOR_BUFFER_BIT)
  }
}
