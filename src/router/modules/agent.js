/** 代理商 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN']

const agentRouter = {
  path: '/agents',
  component: Layout,
  redirect: '/agents/index',
  meta: {
    title: '关于用户',
    icon: 'user',
    roles
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/agentMg/index'),
      name: 'AgentList',
      meta: {
        title: '用户管理',
        icon: 'peoples',
        roles
      }
    },
    {
      path: 'audit',
      component: () => import('@/views/agentMg/audit'),
      name: 'AuditList',
      meta: {
        title: '审核信息',
        icon: 'edit',
        roles
      }
    }
  ]
}

export default agentRouter
