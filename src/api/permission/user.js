import request from '@/utils/request'

export function getList() {
  return request({
    url: '/permission/user/list',
    method: 'get'
  })
}
