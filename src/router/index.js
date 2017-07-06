import Vue from 'vue'
import Router from 'vue-router'
import SnapshotPage from '@/components/SnapshotPage'
import HomePage from '@/components/HomePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/:spreadsheetId/:snapshotId',
      name: 'SnapshotPage',
      component: SnapshotPage,
      props: true
    }
  ]
})
