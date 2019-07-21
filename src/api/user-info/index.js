/**
 * 用户接口
 */

import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getList(query) {
  return request({
    url: '/api/user-infos',
    method: 'get',
    params: query
  })
}

/**
 * 删除用户
 */
export function deleteByLogin(login) {
  return request({
    url: `/api/user-infos/${login}`,
    method: 'delete'
  })
}

/**
 * 获取用户
 */
export function getByLogin(login) {
  return request({
    url: `/api/user-infos/${login}`,
    method: 'get'
  })
}

/**
 * 获取用户列表
 */
export function getSearchList(query) {
  return request({
    url: 'api/_search/user-infos',
    method: 'get',
    params: query
  })
}

/**
 * 添加用户
 */

export function add(data) {
  return request({
    url: '/api/user-infos',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 */

export function modify(data) {
  return request({
    url: '/api/user-infos',
    method: 'put',
    data
  })
}
