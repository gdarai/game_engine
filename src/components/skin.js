import { ninePatch } from '@components/ninePatch.js'

export function applySkin(element, { image, slice, background = '#102a40' } = {}) {
  if (!/^#[0-9a-f]{6}$/i.test(background)) throw new TypeError('Nine-patch background must be a hex color')
  const patch = ninePatch({ image, slice })
  element.style.border = `${patch.slice}px solid transparent`
  element.style.borderImageSource = patch.source
  element.style.borderImageSlice = String(patch.slice)
  element.style.borderImageWidth = `${patch.slice}px`
  element.style.backgroundColor = background
  element.classList.add('nine-patch')
  return element
}
