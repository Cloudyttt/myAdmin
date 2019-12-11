import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie'
import 'normalize.css'
import '@/styles/index.scss' // global css
import '@/permission' // permission control
/*//引入svg组件
import IconSvg from 'components/SvgIcon/index'
//全局注册icon-svg
Vue.component('svg-icon', IconSvg)*/

import '@/icons' // icon
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.$cookie = Cookies;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
