/**
 * 客户完成状态接口
 */
import request from '@/utils/request'

/**
 * 获取客户完成状态列表
 */
export function getList(query) {
  return request({
    url: '/api/finished-conditions',
    method: 'get',
    params: query
  })
}

/**
 * 添加客户完成状态
 */
export function add(data) {
  return request({
    url: '/api/finished-conditions',
    method: 'post',
    data
  })
}

/**
 * 修改客户完成状态
 */
export function update(data) {
  return request({
    url: '/api/finished-conditions',
    method: 'put',
    data
  })
}

/**
 * 删除客户完成状态
 */
export function deleteById(id) {
  return request({
    url: `/api/finished-conditions/${id}`,
    method: 'delete'
  })
}
