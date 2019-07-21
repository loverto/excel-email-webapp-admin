/**
 * 定制模板接口
 */

import request from '@/utils/request'

/**
 * 获取定制模板列表
 */
export function getList(query) {
  return request({
    url: '/api/custom-templates',
    method: 'get',
    params: query
  })
}

/**
 * 获取定制模板列表通过定制状态
 */
export function getListByCustomState(customStateId, query) {
  return request({
    url: `/api/custom-templates/custom-state/${customStateId}`,
    method: 'get',
    params: query
  })
}

/**
 * 获取定制模板列表通过完成状态
 */
export function getListByFinishedCondition(finishedConditionId, query) {
  return request({
    url: `/api/custom-templates/finished-condition/${finishedConditionId}`,
    method: 'get',
    params: query
  })
}

/**
 * 获取定制模板列表通过完成状态
 */
export function getListByFinishedConditionAndModeTypeIdByPage(finishedConditionId, modeTypeId, query) {
  return request({
    url: `/api/custom-templates/finished-condition/mode-type/pages/${finishedConditionId}/${modeTypeId}`,
    method: 'get',
    params: query
  })
}

/**
 * 获取定制模板列表通过完成状态
 */
export function getListByFinishedConditionAndModeTypeId(finishedConditionId, modeTypeId, query) {
  return request({
    url: `/api/custom-templates/finished-condition/mode-type/${finishedConditionId}/${modeTypeId}`,
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新定制模板
 */
export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/custom-templates',
    method,
    data
  })
}

/**
 * 新增或更新定制模板
 */
export function deleteById(id) {
  return request({
    url: `/api/custom-templates/${id}`,
    method: 'delete'
  })
}

/**
 * 获取定制模板列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/custom-templates',
    method: 'get',
    params: query
  })
}

/**
 * 根据定制编号获取定制模版
 */
export function queryCustomTemplatesByCustomNumber(customNumber, query) {
  return request({
    url: `/api/custom-templates/custom-number/${customNumber}`,
    method: 'get',
    params: query
  })
}
