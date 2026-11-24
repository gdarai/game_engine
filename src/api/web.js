import { fetchJson } from './request.js'

const USERNAME_KEY = 'game-layer.username'

export function createWebBackend(browser = window, fetchRequest = fetch) {
  return {
    isPortrait() {
      return browser.matchMedia('(orientation: portrait)').matches
    },
    getCredentials() {
      return { username: browser.localStorage.getItem(USERNAME_KEY) ?? '', password: '' }
    },
    setCredentials({ username }) {
      if (typeof username !== 'string') throw new TypeError('Username must be a string')
      browser.localStorage.setItem(USERNAME_KEY, username)
    },
    async getStatus() {
      const status = await fetchJson('/api/status', fetchRequest)
      if (status?.ok !== true) throw new Error('Invalid status response')
      return status
    },
  }
}
