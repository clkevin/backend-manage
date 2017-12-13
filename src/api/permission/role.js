import request from '@/utils/request'

export function getList() {
  return request({
    url: '/permission/role/list',
    method: 'get'
  })
}
