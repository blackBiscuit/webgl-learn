import Track from './track'
export default class Compose {
  parent: null = null
  children: Track[] = []
   constructor() {}
  add(obj: Track) {
    obj.parent = this
    this.children.push(obj)
  }
  update(t: Date) {
    this.children.forEach((item) => {
      item.update(t)
    })
  }
}
