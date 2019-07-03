import Cookies from 'js-cookie'
import myconfig from '@/config'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {
    expires: myconfig.cookieExpires
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
