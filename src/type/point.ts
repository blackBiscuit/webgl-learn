export interface Color {
  r: number
  g: number
  b: number
}
export interface PointProps {
  x: number
  y: number
  size: number
  color: Color
  a: number
}
export interface PointFourthProps {
  x: number
  y: number
  size: number
}
export type PointKeys = keyof PointProps
export interface PointSixProps {
  x: number
  y: number
  size: number
  color: { r: number; g: number; b: number; a: number }
}
