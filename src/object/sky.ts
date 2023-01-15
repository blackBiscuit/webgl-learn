import { Poly } from './Poly'
export class Sky<T extends Record<string, any> = Record<string, any>,K extends keyof T = keyof T> {
  public children: Poly<T>[] = []
  constructor(public gl: WebGLRenderingContext) {
    this.gl = gl
  }
  add(obj: Poly<T>) {
    obj.gl = this.gl
    this.children.push(obj)
  }
  updateVertices(params: K[]) {
    this.children.forEach((ele) => {
      ele.updateVertices(params)
    })
  }
  draw() {
    this.children.forEach((ele) => {
      ele.init()
      ele.draw()
    })
  }
}
