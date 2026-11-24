// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest'
import { ErrorDialog } from '@components/ErrorDialog.js'
import { getMemory, setError } from '@utils/memory.js'

afterEach(() => {
  document.body.replaceChildren()
  setError('')
})

it('shows existing and subsequent errors in a dismissible red nine-patch alert', () => {
  setError('Service unavailable')
  const dialog = ErrorDialog()
  document.body.append(dialog.element)
  const button = dialog.element.querySelector('button')
  expect(dialog.element.getAttribute('role')).toBe('alert')
  expect(dialog.element.hidden).toBe(false)
  expect(button.textContent).toBe('Service unavailable')
  expect(button.style.borderImageSource).toContain('error.svg')

  setError('Unable to save username')
  expect(button.textContent).toBe('Unable to save username')
  button.click()
  expect(getMemory().error).toBe('')
  expect(dialog.element.hidden).toBe(true)

  dialog.dispose()
  setError('After disposal')
  expect(dialog.element.hidden).toBe(true)
})

it('starts hidden without an error', () => {
  const dialog = ErrorDialog()
  expect(dialog.element.hidden).toBe(true)
  dialog.dispose()
})
