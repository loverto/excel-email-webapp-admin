/** 审核管理 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN']

const picRouter = {
  path: '/pic',
  component: Layout,
  redirect: '/pic/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/pic/index'),
      name: 'picList',
      meta: {
        title: '图库浏览',
        icon: 'nested',
        roles
      }
    }
  ]
}

export default picRouter
