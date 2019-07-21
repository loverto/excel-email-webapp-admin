/**
 * 上传参数接口
 */
import request from '@/utils/request'

/**
 * 获取上传参数列表
 */
export function getList(query) {
  return request({
    url: '/api/upload-settings',
    method: 'get',
    params: query
  })
}

/**
 * 添加上传参数
 */
export function add(data) {
  return request({
    url: '/api/upload-settings',
    method: 'post',
    data
  })
}

/**
 * 修改上传参数
 */
export function update(data) {
  return request({
    url: '/api/upload-settings',
    method: 'put',
    data
  })
}

/**
 * 删除上传参数
 */
export function deleteById(id) {
  return request({
    url: `/api/upload-settings/${id}`,
    method: 'delete'
  })
}
