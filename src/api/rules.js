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
    url: '/admin/auth_rules/'+id,
    method: 'get',
  })
}

export function updateAuthRule(id,data) {
  return request({
    url: '/admin/auth_rules/'+id,
    method: 'put',
    data
  })
}

export function getListAll() {
  return request({
    url: '/admin/rules/getLists',
    method: 'post'
  })
}





export function del(id) {
  return request({
    url: '/admin/rules/del',
    method: 'get',
    params: { id }
  })
}

export function change(id, field, value) {
  const data = {
    val: id,
    field: field,
    value: value
  }
  return request({
    url: '/admin/rules/change',
    method: 'post',
    data
  })
}

export function delAll(data) {
  return request({
    url: '/admin/rules/delall',
    method: 'post',
    data
  })
}

export function changeAll(data) {
  return request({
    url: '/admin/rules/changeall',
    method: 'post',
    data
  })
}
