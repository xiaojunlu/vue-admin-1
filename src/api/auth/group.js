import request from '@/utils/request'

export function getAuthGroupList(query) {
  return request({
    url: '/admin/auth_groups',
    method: 'get',
    data: query
  })
}
