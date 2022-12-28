import Compose from './compose'
// [时间, 属性值]
type KeyMapItem = [number, number]
type KeyMap = KeyMapItem[]
function setObjVal<Type, Key extends keyof Type>(
  target: Type,
  key: Key,
  value: any
) {
  target[key] = value
}
export default class Track<T extends any = any, K extends keyof T = keyof T> {
  target: T
  parent: Compose | null
  start = new Date()
  timerLen = 5
  loop = false
  keyMap = new Map<K, KeyMap>()
  constructor(target: T) {
    this.target = target
    this.parent = null
  }
  update(t: Date) {
    const { keyMap, loop, target, timerLen, start } = this

    let time = t.getTime() - start.getTime()
    if (loop) {
      time = time % timerLen
    }
    for (const [key, fms] of keyMap.entries()) {
      const last = fms.length - 1
      if (time < fms[0][0]) {
        // target[key] = fms[0][1]
        setObjVal(target, key, fms[0][1])
      } else if (time > fms[last][0]) {
        setObjVal(target, key, fms[last][1])
        //target[key] = fms[last][1]
      } else {
        setObjVal(target, key, getValBetweenFms(time, fms, last))
        // target[key] = getValBetweenFms(time, fms, last)
      }
    }
  }
}
const getValBetweenFms = (time: number, fms: KeyMap, last: number) => {
  for (let i = 0; i < last; i++) {
    const fm1 = fms[i]
    const fm2 = fms[i + 1]
    if (time >= fm1[0] && time <= fm2[0]) {
      // AB两点 AB = B - A
      // y = kx + b
      // AB = (bx - ax, by - ay)
      // 斜率 k = AB.y / AB.x
      // b = ay - ax * k
      const delta = {
        x: fm2[0] - fm1[0],
        y: fm2[1] - fm2[1]
      }
      const k = delta.y / delta.x
      const b = fm1[1] - fm1[0] * k
      return k * time + b
    }
  }
  return 0
}
