import Vue from 'vue'

// Panels

export const OPEN_PANEL = (state, {panelName}) => {
  Vue.set(state[panelName], 'isOpen', true)
}

export const CLOSE_PANEL = (state, {panelName}) => {
  Vue.set(state[panelName], 'isOpen', false)
}

export const TOGGLE_PANEL = (state, {panelName}) => {
  Vue.set(state[panelName], 'isOpen', !state[panelName].isOpen)
}

// Radar details

export const GET_RADAR_DETAILS_REQUEST = (state) => {
  Vue.set(state.loaders, 'radarDetails', true)
  Vue.set(state, 'radarDetails', false)
}

export const GET_RADAR_DETAILS_SUCCESS = (state, {response}) => {
  Vue.set(state.loaders, 'radarDetails', false)
  Vue.set(state, 'radarDetails', response)
}

export const GET_RADAR_DETAILS_FAIL = (state, {response}) => {
  Vue.set(state.loaders, 'radarDetails', false)
  Vue.set(state, 'radarDetails', false)
}

// Snapshots

export const GET_SNAPSHOTS_REQUEST = (state) => {
  Vue.set(state.loaders, 'snapshots', true)
  Vue.set(state, 'snapshots', [])
}

export const GET_SNAPSHOTS_SUCCESS = (state, {response}) => {
  Vue.set(state.loaders, 'snapshots', false)
  Vue.set(state, 'snapshots', response)
}

export const GET_SNAPSHOTS_FAIL = (state, {response}) => {
  Vue.set(state.loaders, 'snapshots', false)
  Vue.set(state, 'snapshots', [])
}

// All Blips

export const GET_BLIPS_REQUEST = (state) => {
  Vue.set(state.loaders, 'blips', true)
  Vue.set(state, 'allBlips', null)
}

export const GET_BLIPS_SUCCESS = (state, {response}) => {
  Vue.set(state.loaders, 'blips', false)
  Vue.set(state, 'allBlips', response)
}

export const GET_BLIPS_FAIL = (state, {response}) => {
  Vue.set(state.loaders, 'blips', false)
  Vue.set(state, 'allBlips', null)
}

// Snapshot

export const GET_SNAPSHOT_REQUEST = (state) => {
  Vue.set(state.loaders, 'snapshot', true)
  Vue.set(state, 'currentSnapshot', null)
}

export const GET_SNAPSHOT_SUCCESS = (state, {response}) => {
  Vue.set(state.loaders, 'snapshot', false)
  Vue.set(state, 'currentSnapshot', response)
}

export const GET_SNAPSHOT_FAIL = (state, {response}) => {
  Vue.set(state.loaders, 'snapshot', false)
  Vue.set(state, 'currentSnapshot', null)
}

// Blip details

export const GET_BLIP_REQUEST = (state) => {
  Vue.set(state.loaders, 'blip', true)
  Vue.set(state, 'blipDetails', null)
}

export const GET_BLIP_SUCCESS = (state, {response}) => {
  Vue.set(state.loaders, 'blip', false)
  Vue.set(state, 'blipDetails', response)
}

export const GET_BLIP_FAIL = (state, {response}) => {
  Vue.set(state.loaders, 'blip', false)
  Vue.set(state, 'blipDetails', null)
}
