import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/admin/auth_rules',
    method: 'get',
    data: query
  })
}

export function getAuthRule(id) {
  return request({
    url: '/admin/auth_rules/' + id,
    method: 'get'
  })
}

export function createAuthRule(data) {
  return request({
    url: '/admin/auth_rules',
    method: 'post',
    data
  })
}

export function updateAuthRule(id, data) {
  return request({
    url: '/admin/auth_rules/' + id,
    method: 'put',
    data
  })
}
