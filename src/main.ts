// import { first,second,third,fourth,fifth,sixth,seventh } from './content'
import { eighteenth } from './content/index'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`
eighteenth()
