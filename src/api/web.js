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
      const response = await fetchRequest('/api/status')
      if (!response.ok) throw new Error(`Status request failed (HTTP ${response.status})`)
      const status = await response.json()
      if (status?.ok !== true) throw new Error('Invalid status response')
      return status
    },
  }
}
