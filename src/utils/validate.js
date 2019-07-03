/**
 * xiegaolei
 */

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/**
 * validate phone
 * @param phone
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const re = /^1\d{10}$/
  return re.test(phone)
}

// 手机号码
export function validMobile(mobile) {
  const reg = /^1\d{10}$/
  return reg.test(mobile)
}

// 身份证
export function validIdcard(idcardNumber) {
  const reg = /^\d{17}[0-9xX]$/i
  if (!reg.test(idcardNumber)) {
    return false
  }
  const n = new Date()
  const y = n.getFullYear()
  if (parseInt(idcardNumber.substr(6, 4)) < 1900 || parseInt(idcardNumber.substr(6, 4)) > y) {
    return false
  }
  const birth = idcardNumber.substr(6, 4) + '-' + idcardNumber.substr(10, 2) + '-' + idcardNumber.substr(12, 2)
  if (!'undefined' === typeof birth.getDate) {
    return false
  }
  const IW = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  let iSum = 0
  for (let i = 0; i < 17; i++) {
    iSum += parseInt(idcardNumber.charAt(i)) * IW[i]
  }
  const iJYM = iSum % 11
  let sJYM = ''
  if (iJYM === 0) sJYM = '1'
  else if (iJYM === 1) sJYM = '0'
  else if (iJYM === 2) sJYM = 'x'
  else if (iJYM === 3) sJYM = '9'
  else if (iJYM === 4) sJYM = '8'
  else if (iJYM === 5) sJYM = '7'
  else if (iJYM === 6) sJYM = '6'
  else if (iJYM === 7) sJYM = '5'
  else if (iJYM === 8) sJYM = '4'
  else if (iJYM === 9) sJYM = '3'
  else if (iJYM === 10) sJYM = '2'
  const cCheck = idcardNumber.charAt(17).toLowerCase()
  if (cCheck !== sJYM) {
    return false
  }
  return true
}
