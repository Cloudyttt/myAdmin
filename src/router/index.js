import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index'

Vue.use(VueRouter)
// import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'), // 路由懒加载
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/projectCard',
    meta: {
      title: '首页',
      icon: 'home',
    },
    children: [
      {
        path: 'projectCard',
        name: 'ProjectCard',
        component: () => import('@/views/projectCard/index'),
        meta: {
          title: '我的项目',
          icon: 'integral',
        }
      },
      /*{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'home',
      },
      children: []
    }*/
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/table',
    name: 'project',
    meta: {
      title: '项目管理',
      icon: 'all',
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: {
          title: '项目列表',
          icon: 'calculator',
        }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: {
          title: '创建项目',
          icon: 'add'
        }
      },
      {
        path: 'buildingConfig',
        name: 'BuildingConfig',
        component: () => import('@/views/buildingConfig/index'),
        meta: {
          title: '建筑配置',
          icon: 'Moneymanagement',
        }
      }
    ]
  },
  {
    path: '/adminer',
    name: 'Layout',
    component: Layout,
    redirect: '/adminer',
    children: [{
      path: 'adminer',
      name: 'Ddminer',
      component: () => import('@/views/adminer/index'),
      meta: {
        title: '管理员',
        icon: 'certified-supplier',
      }
    }]
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: () => import('components/pwc/HomePage/index'),
    props:true,
    hidden:true,
    meta: {
      title: 'PWC',
      icon: 'home',
    },
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

/*// 设置路由跳转的NProgress
router.beforeEach((to, from, next) => {
  console.log('beforeEach');
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})*/

export default router
