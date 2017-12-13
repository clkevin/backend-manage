import request from '@/utils/request'

export function getModuleList() {
  return request({
    url: '/permission/module/list',
    method: 'get'
  })
}
