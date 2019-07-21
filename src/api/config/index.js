/**
 * 系统参数接口
 */
import request from '@/utils/request'

/**
 * 获取系统参数列表
 */
export function getList(query) {
  return request({
    url: '/api/configs',
    method: 'get',
    params: query
  })
}

/**
 * 添加系统参数
 */
export function add(data) {
  return request({
    url: '/api/configs',
    method: 'post',
    data
  })
}

/**
 * 修改系统参数
 */
export function update(data) {
  return request({
    url: '/api/configs',
    method: 'put',
    data
  })
}

/**
 * 删除系统参数
 */
export function deleteById(id) {
  return request({
    url: `/api/configs/${id}`,
    method: 'delete'
  })
}
