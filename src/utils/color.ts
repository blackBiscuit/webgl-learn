
export type Colors = [number, number, number]
// 将rgb 颜色转换为webgl颜色
export const initColor = (colors: Colors): Colors => {
  const flag = colors.some((color) => color > 255 || color < 0)
  if (flag) return [0, 0, 0]
  return colors.map((item) => +(item / 255).toFixed(2)) as Colors
}
