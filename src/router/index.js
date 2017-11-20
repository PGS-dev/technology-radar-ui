import Vue from 'vue'
import Router from 'vue-router'
import SnapshotPage from '@/components/SnapshotPage'
import RadarHomePage from '@/components/RadarHomePage'
import HomePage from '@/components/HomePage'
import BlipPage from '@/components/BlipPage'
import OverviewPage from '@/components/OverviewPage'
import PrintOverviewPage from '@/components/PrintOverviewPage'

Vue.use(Router)

export default new Router({
  base: '/technology-radar-ui',
  mode: 'history',
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
      path: '/:spreadsheetId/overview',
      name: 'OverviewPage',
      component: OverviewPage,
      props: true
    },
    {
      path: '/:spreadsheetId/overview/print',
      name: 'PrintOverviewPage',
      component: PrintOverviewPage,
      props: true
    },
    {
      path: '/:spreadsheetId/:snapshotId',
      name: 'SnapshotPage',
      component: SnapshotPage,
      props: true
    },
    {
      path: '/:spreadsheetId/blip/:blipId',
      name: 'BlipPage',
      component: BlipPage,
      props: true
    }
  ]
})
