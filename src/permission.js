/*
* 路由权限管理
* 路由守卫
* */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  console.log(from, 'to.meta.title', to.meta.title);
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log('是否已有令牌：', hasToken)
  if (hasToken) {
    if (to.path === '/login') { // 如果已经登陆，还想跳转到登陆界面则默认跳转到主页
      console.log('to.path === login')
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else { // 如果已经登陆，且所要跳转的路由不是login
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) { // 则判断是否已经拉取了用户信息，已拉取则正常跳转到目的路由
        console.log('已拉取用户信息')
        next()
      } else { // 还没有获得用户信息则去拉取用户信息
        console.log('尚未拉取用户信息')
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { // 无令牌，尚未登陆
    /* has no token*/
    console.log('无令牌，尚未登陆');
    if (whiteList.indexOf(to.path) !== -1) { // 如果目的路由是在白名单中则允许直接跳转
      // in the free login whitelist, go directly
      next()
    } else { // 否则一律跳转到登陆界面，并且将这个目的路由作为参数传给login，存储下来，以便下次成功登陆后立即跳转到这个目的路由
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
