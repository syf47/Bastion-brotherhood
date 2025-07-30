import { ss } from './storage'

const STORAGE_KEY = 'token'

function getToken() {
  return ss.get(STORAGE_KEY)
}

function setToken(token: string) {
  return ss.set(STORAGE_KEY, token)
}

function removeToken() {
  return ss.remove(STORAGE_KEY)
}

function haveToken() {
  return !!getToken()
}

export { haveToken, getToken, setToken, removeToken }
