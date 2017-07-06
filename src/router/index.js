import Vue from 'vue'
import Router from 'vue-router'
import Snapshot from '@/components/Snapshot'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Snapshot',
      component: Snapshot
    }
  ]
})
