/**
 * 设计素材接口
 */
import request from '@/utils/request'

/**
 * 获取设计素材列表
 */
export function getList(query) {
  return request({
    url: '/api/fabric-design-materials',
    method: 'get',
    params: query
  })
}

/**
 * 添加设计素材
 */
export function add(data) {
  return request({
    url: '/api/fabric-design-materials',
    method: 'post',
    data
  })
}

/**
 * 修改设计素材
 */
export function update(data) {
  return request({
    url: '/api/fabric-design-materials',
    method: 'put',
    data
  })
}

/**
 * 删除设计素材
 */
export function deleteById(id) {
  return request({
    url: `/api/fabric-design-materials/${id}`,
    method: 'delete'
  })
}

/**
 * 获取某个定制的素材设计素材
 */
export function getAllDesignMaterialByCustomTemplate(customTemplateId) {
  return request({
    url: `/api/fabric-design-materials/custom-templates/${customTemplateId}`,
    method: 'get'
  })
}

/**
 * 获取某个定制的素材设计素材
 */
export function getAllDesignMaterialByCustomNumber(customNumber) {
  return request({
    url: `/api/fabric-design-materials/custom-templates-custom-number/${customNumber}`,
    method: 'get'
  })
}
