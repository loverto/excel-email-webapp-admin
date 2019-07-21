/**
 * 字体名称接口
 */

import request from '@/utils/request'

/**
 * 获取字体名称列表
 */
export function getList(query) {
  return request({
    url: '/api/wxyj',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新字体名称
 */

export function send(data, method = 'post') {
  return request({
    url: '/api/wxyj',
    method,
    data
  })
}

/**
 * 获取字体列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/wxyj',
    method: 'get',
    params: query
  })
}
