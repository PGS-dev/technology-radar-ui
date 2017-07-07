import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

// initial state
const state = {
  spreadsheetId: false,
  radarDetails: {
    tittle: 'Technology Radar'
  },
  loaders: {},
  snapshotsPanel: {
    isOpen: true
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
