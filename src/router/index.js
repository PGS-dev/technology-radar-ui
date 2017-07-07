import Vue from 'vue'
import Router from 'vue-router'
import SnapshotPage from '@/components/SnapshotPage'
import RadarHomePage from '@/components/RadarHomePage'
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
      path: '/:spreadsheetId',
      name: 'RadarHomePage',
      component: RadarHomePage,
      props: true
    },
    {
      path: '/:spreadsheetId/:snapshotId',
      name: 'SnapshotPage',
      component: SnapshotPage,
      props: true
    }
  ]
})
