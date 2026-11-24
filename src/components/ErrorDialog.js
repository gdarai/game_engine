import { applySkin } from '@components/skin.js'
import { getMemory, setError, subscribe } from '@utils/memory.js'

export function ErrorDialog() {
  const element = document.createElement('div')
  element.className = 'error-dialog'
  element.setAttribute('role', 'alert')
  const dismiss = document.createElement('button')
  dismiss.type = 'button'
  dismiss.title = 'Dismiss error'
  applySkin(dismiss, { image: 'error.svg', slice: 12, background: '#43272d' })
  element.append(dismiss)

  function update(memory) {
    dismiss.textContent = memory.error
    element.hidden = !memory.error
  }

  update(getMemory())
  const unsubscribe = subscribe(update)
  dismiss.addEventListener('click', () => setError(''))

  return { element, dispose: unsubscribe }
}
