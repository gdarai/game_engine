import { applySkin } from '@components/skin.js'

export function TextInput({ label, name, value = '', type = 'text', skin } = {}) {
  if (!label || !name || !['text', 'password'].includes(type)) {
    throw new TypeError('TextInput requires a label, name and supported type')
  }
  const element = document.createElement('label')
  element.className = 'input-field'
  const caption = document.createElement('span')
  caption.textContent = label
  const input = document.createElement('input')
  input.name = name
  input.type = type
  input.value = value
  input.required = true
  if (type === 'text') input.autocomplete = 'username'
  if (type === 'password') input.autocomplete = 'current-password'
  applySkin(input, skin)
  element.append(caption, input)
  return { element, input }
}
