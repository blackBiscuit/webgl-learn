
import { first,second,third,fourth,fifth,sixth,seventh } from './content'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`
seventh()