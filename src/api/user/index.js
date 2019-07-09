import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 获取当前登录信息
export function getUserInfo() {
  return request({
    url: '/admin/getuser',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(query) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: query
  })
}

// 获取用户信息
export function getUser(id) {
  return request({
    url: '/admin/users/' + id,
    method: 'get'
  })
}

// 新增用户
export function createUser(data) {
  return request({
    url: '/admin/users',
    method: 'post',
    data
  })
}

// 更新用戶
export function updateUser(id, data) {
  return request({
    url: '/admin/users/' + id,
    method: 'put',
    data
  })
}

// 检测用户名
export function checkUsername(username) {
  return request({
    url: '/admin/users/username/check',
    method: 'get',
    params: {
      username: username
    }
  })
}

// 删除用户
export function deleteUser(id) {

}
