/** Banner管理 */

import Layout from '@/layout'

const roles = ['ROLE_ADMIN', 'ROLE_DEVELOPMENT']

const bannerRouter = {
  path: '/die-pattern',
  component: Layout,
  redirect: '/die-pattern/index',
  name: 'Banners',
  meta: {
    title: '文件管理',
    icon: 'clipboard',
    roles
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/diePatternMg/index'),
      name: 'BannerList',
      meta: {
        title: '刀模图管理',
        icon: 'list',
        roles
      }
    },
    {
      path: '/font-manager/index',
      component: () => import('@/views/fontManagerMg/index'),
      name: 'FontManagerMgList',
      meta: {
        title: '字体文件管理',
        icon: 'list',
        roles
      }
    },
    {
      path: '/die-pattern/add',
      hidden: true,
      component: () => import('@/views/diePatternMg/add'),
      name: 'dieAdd',
      meta: {
        title: '刀模图添加',
        icon: 'form',
        roles
      }
    },
    {
      path: '/die-pattern/edit',
      hidden: true,
      component: () => import('@/views/diePatternMg/edit'),
      name: 'dieEdit',
      meta: {
        title: '刀模图编辑',
        icon: 'form',
        roles
      }
    },
    {
      path: '/official-gallerie/index',
      component: () => import('@/views/officialGallerieMg/index'),
      name: 'officialGallerieList',
      meta: {
        title: '官方图库',
        icon: 'form',
        roles
      }
    },
    {
      path: '/official-gallerie/add',
      hidden: true,
      component: () => import('@/views/officialGallerieMg/add'),
      name: 'officialGallerieAdd',
      meta: {
        title: '官方图库添加',
        icon: 'form',
        roles
      }
    },
    {
      path: '/official-gallerie/edit',
      hidden: true,
      component: () => import('@/views/officialGallerieMg/edit'),
      name: 'officialGallerieEdit',
      meta: {
        title: '官方图库编辑',
        icon: 'form',
        roles
      }
    }
  ]
}

export default bannerRouter
