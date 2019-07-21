/**
 * 用户接口
 */

import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getList(query) {
  return request({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户列表
 */
export function getUserExtendByUserId(id) {
  return request({
    url: `/api/user-extends/user/${id}`,
    method: 'get'
  })
}

/**
 * 删除用户
 */
export function deleteByLogin(login) {
  return request({
    url: `/api/users/${login}`,
    method: 'delete'
  })
}

/**
 * 获取用户
 */
export function getByLogin(login) {
  return request({
    url: `/api/users/${login}`,
    method: 'get'
  })
}

/**
 * 获取用户列表
 */
export function getSearchList(query) {
  return request({
    url: 'api/_search/users',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户列表
 */
export function getWorkList(query) {
  return request({
    url: '/api/users/works',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户列表
 */
export function getWorkListData(query) {
  return request({
    url: '/api/users/works/data',
    method: 'get',
    params: query
  })
}

/**
 * 获取Excel的数据用户列表
 */
export function getWorkListExcel(query) {
  return request({
    url: '/api/users/works/data',
    method: 'get',
    params: query
  })
}

/**
 * 获取角色列表
 */
export function getRoleList(query) {
  return request({
    url: '/api/users/authorities',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户审计信息
 */
export function getAudits(query) {
  return request({
    url: '/management/audits',
    method: 'get',
    params: query
  })
}

/**
 * 注册用户
 */

export function register(data) {
  return request({
    url: '/api/register',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 */

export function modify(data) {
  return request({
    url: '/api/users',
    method: 'put',
    data
  })
}

/**
 * 修改用户扩展信息
 */
export function update(data) {
  return request({
    url: '/api/user-extends',
    method: 'put',
    data
  })
}

/**
 * 新增用户扩展信息
 */
export function save(data) {
  return request({
    url: '/api/user-extends',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 */

export function resetpwd(data) {
  return request({
    url: '/api/resetpwd',
    method: 'put',
    data
  })
}

