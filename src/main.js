import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie'
import 'normalize.css'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/icon.css'
import '@/styles/index.scss' // global css

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.$cookie = Cookies;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
