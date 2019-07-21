/**
 * 定制状态接口
 */
import request from '@/utils/request'

/**
 * 获取定制状态列表
 */
export function getList(query) {
  return request({
    url: '/api/custom-states',
    method: 'get',
    params: query
  })
}

/**
 * 添加定制状态
 */
export function add(data) {
  return request({
    url: '/api/custom-states',
    method: 'post',
    data
  })
}

/**
 * 修改定制状态
 */
export function update(data) {
  return request({
    url: '/api/custom-states',
    method: 'put',
    data
  })
}

/**
 * 删除定制状态
 */
export function deleteById(id) {
  return request({
    url: `/api/custom-states/${id}`,
    method: 'delete'
  })
}
