import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

//导入全局样式
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
}).$mount('#app')
