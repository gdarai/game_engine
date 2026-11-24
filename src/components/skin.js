import { ninePatch } from '@components/ninePatch.js'

export function applySkin(element, { stroke = '#a9dbec', background = '#102a40', ornament } = {}) {
  if (!/^#[0-9a-f]{6}$/i.test(background)) throw new TypeError('Nine-patch background must be a hex color')
  element.style.borderImageSource = ninePatch({ stroke, ornament })
  element.style.backgroundColor = background
  element.classList.add('nine-patch')
  return element
}
