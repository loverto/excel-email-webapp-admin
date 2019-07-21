/**
 * 官方图类型接口
 */

import request from '@/utils/request'

/**
 * 获取官方图类型列表
 */
export function getList(query) {
  return request({
    url: '/api/image-types',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新官方图类型
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/image-types',
    method,
    data
  })
}

/**
 * 删除官方图类型
 */
export function deleteById(id) {
  return request({
    url: `/api/image-types/${id}`,
    method: 'delete'
  })
}

