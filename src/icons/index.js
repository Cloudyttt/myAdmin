import Vue from 'vue'
import SvgIcon from 'components/SvgIcon/index'// svg component

// register globally
Vue.component('svg-icon', SvgIcon);

// 这行代码就会去 svg 文件夹（不包含子目录）下面的找所有文件名以 .svg 结尾的文件能被 require 的文件。 更直白的说就是 我们可以通过正则匹配引入相应的文件模块。
const requireComponents = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(requireComponents)
