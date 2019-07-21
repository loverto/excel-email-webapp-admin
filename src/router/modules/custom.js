/** Banner管理 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN']

const customRouter = {
  path: '/customs',
  component: Layout,
  redirect: '/customs/index',
  name: 'Customs',
  meta: {
    title: '定单流程',
    icon: 'example',
    roles
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/customTemplateMg/index'),
      name: 'customConfirm',
      meta: {
        title: '定单确认',
        icon: 'list',
        roles
      }
    },
    {
      path: '/custom-template/make',
      component: () => import('@/views/customTemplateMg/made'),
      name: 'makeCustom',
      meta: {
        title: '定单制造',
        icon: 'form',
        roles
      }
    },
    {
      path: '/custom/sent',
      component: () => import('@/views/customTemplateMg/sent'),
      name: 'CustomSent',
      meta: {
        title: '定单发货',
        icon: 'form',
        roles
      }
    },
    {
      path: '/custom/manager',
      component: () => import('@/views/customTemplateMg/manager'),
      name: 'CustomManager',
      meta: {
        title: '定单管理',
        icon: 'form',
        roles
      }
    }
  ]
}

export default customRouter
