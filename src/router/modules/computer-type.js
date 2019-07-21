/** 产品 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN']
const dev = ['ROLE_ADMIN', 'ROLE_DEVELOPMENT']

const productRouter = {
  path: '/system-settings',
  component: Layout,
  redirect: '/system-settings/index',
  name: 'SystemSettings',
  meta: {
    title: '系统功能',
    icon: 'component'
  },
  children: [
    {
      path: 'user-info',
      component: () => import('@/views/userInfoMg/index'),
      name: 'UserInfos',
      meta: {
        title: '用户联系方式管理',
        icon: 'peoples',
        dev
      }
    },
    {
      path: 'index',
      component: () => import('@/views/emailConfigMg/index'),
      name: 'EmailConfigList',
      meta: {
        title: '邮箱设置',
        icon: 'email',
        dev
      }
    },
    {
      path: '/system-settings/wuxianyijin',
      component: () => import('@/views/fontMg/index'),
      name: 'InsuranceHousingFund',
      meta: {
        title: '五险一金调整邮件通知',
        icon: 'excel',
        dev
      }
    },
    {
      path: '/system-settings/gongzitiao',
      component: () => import('@/views/configMg/settings'),
      name: 'Settings',
      meta: {
        title: '工资条',
        icon: 'excel',
        roles
      }
    }
  ]
}

export default productRouter
