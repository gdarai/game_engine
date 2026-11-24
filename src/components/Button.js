import { applySkin } from '@components/skin.js'

export function Button({ label, type = 'button', skin } = {}) {
  if (!label || !['button', 'submit'].includes(type)) throw new TypeError('Button requires a label and valid type')
  const element = document.createElement('button')
  element.type = type
  element.textContent = label
  applySkin(element, skin)
  return element
}
