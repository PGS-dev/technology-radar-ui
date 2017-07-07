// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: {
    color: 'orange',
    hue: 700,
    textColor: 'white'
  },
  accent: 'red',
  warn: 'red',
  background: 'white'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
