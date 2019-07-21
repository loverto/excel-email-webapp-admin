/**
 * 官方图库接口
 */

import request from '@/utils/request'

/**
 * 获取官方图库列表
 */
export function getList(query) {
  return request({
    url: '/api/official-galleries',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新官方图库
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/official-galleries',
    method,
    data
  })
}

/**
 * 删除官方图库
 */
export function deleteById(id) {
  return request({
    url: `/api/official-galleries/${id}`,
    method: 'delete'
  })
}

