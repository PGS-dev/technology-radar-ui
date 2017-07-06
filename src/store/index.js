import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// initial state
const state = {
  spreadsheetId: '11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc',
  radarDetails: {
    tittle: 'Technology Radar'
  },
  loaders: {},
  snapshotsPanel: {
    isOpen: false
  },
  detailsPanel: {
    isOpen: false
  },
  currentSnapshot: {},
  snapshots: false,
  allBlips: []
}

export default new Vuex.Store({
  state,
  actions,
  mutations
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
