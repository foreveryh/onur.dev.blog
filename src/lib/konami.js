export const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight'
]

export class KonamiListener {
  constructor(onComplete) {
    this.sequence = []
    this.onComplete = onComplete
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  start() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  stop() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(event) {
    this.sequence.push(event.code)

    // 只保留最近的序列长度
    if (this.sequence.length > KONAMI_CODE.length) {
      this.sequence = this.sequence.slice(-KONAMI_CODE.length)
    }

    // 检查是否匹配
    if (this.sequence.length === KONAMI_CODE.length) {
      const isMatch = this.sequence.every((key, index) => key === KONAMI_CODE[index])
      if (isMatch) {
        this.onComplete()
        this.sequence = [] // 重置序列
      }
    }
  }
}
