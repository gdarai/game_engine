import { TextInput } from '@components/TextInput.js'

export function PasswordInput(options = {}) {
  return TextInput({ ...options, type: 'password' })
}
