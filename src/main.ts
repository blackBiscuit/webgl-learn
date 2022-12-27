
import { first,second,third,fourth,fifth,sixth } from './content'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`
sixth()