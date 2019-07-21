/**
 * 邮件内容接口
 */
import request from '@/utils/request'

/**
 * 获取邮件内容列表
 */
export function getList(query) {
  return request({
    url: '/api/mail-contents',
    method: 'get',
    params: query
  })
}

/**
 * 添加邮件内容
 */
export function add(data) {
  return request({
    url: '/api/mail-contents',
    method: 'post',
    data
  })
}

/**
 * 修改邮件内容
 */
export function update(data) {
  return request({
    url: '/api/mail-contents',
    method: 'put',
    data
  })
}

/**
 * 删除邮件内容
 */
export function deleteById(id) {
  return request({
    url: `/api/mail-contents/${id}`,
    method: 'delete'
  })
}
