import { afterEach, expect, it, vi } from 'vitest'
import { getMemory, setError, setScene, subscribe } from '@utils/memory.js'

afterEach(() => {
  setScene('login')
  setError('')
})

it('starts on login with no error and returns an isolated snapshot', () => {
  const snapshot = getMemory()
  snapshot.scene = 'changed'
  expect(getMemory()).toEqual({ scene: 'login', error: '' })
})

it('notifies subscribers of changes and permits unsubscribing', () => {
  const listener = vi.fn()
  const unsubscribe = subscribe(listener)
  setError('Offline')
  expect(listener).toHaveBeenCalledWith({ scene: 'login', error: 'Offline' })
  unsubscribe()
  listener.mockClear()
  setError('')
  expect(listener).not.toHaveBeenCalled()
})

it('rejects invalid state values', () => {
  expect(() => setScene('')).toThrow(TypeError)
  expect(() => setError(null)).toThrow(TypeError)
  expect(() => subscribe(null)).toThrow(TypeError)
})
