import bgm from '../assets/audio/虫儿飞.mp3'
const audio = new Audio()
export const loadBgm = () => {
  if (audio.paused) {
    audio.src = bgm
    audio.loop = true
    audio.play()
  }
}
