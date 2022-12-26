
import { first,second,third,fourth } from './content'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`
fourth()