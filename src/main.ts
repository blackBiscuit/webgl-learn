// import { first,second,third,fourth,fifth,sixth,seventh } from './content'
import { twelfth } from './content/index'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas"></canvas>
  </div>
`
twelfth()
