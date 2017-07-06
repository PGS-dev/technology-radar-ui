import {getSnapshots} from '../services/snapshots'

export const openPanel = ({commit}, panelName) => {
  commit('OPEN_PANEL', {panelName})
}

export const closePanel = ({commit}, panelName) => {
  commit('CLOSE_PANEL', {panelName})
}

export const togglePanel = ({commit}, panelName) => {
  commit('TOGGLE_PANEL', {panelName})
}

export const fetchSnapshots = ({commit}, spreadsheetId) => {
  commit('FETCH_SNAPSHOTS')

  return getSnapshots(spreadsheetId)
    .then((response) => {
      commit('FETCH_SNAPSHOTS_SUCCESS', {response})
    })
    .catch((error) => commit('FETCH_SNAPSHOTS_FAIL', {error: error.json()}))
}
//
// export const fetchBlips = ({commit}, {spreadsheetId, snapshotId}) => {
//   const url = `${BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`
//
//   return fetch(url)
//     .then((response) => commit('UPDATE_BLIPS', {response: response.json()}))
//     .catch((error) => commit('FETCH_BLIPS_FAIL', {error: error.json()}))
// }
//
// export const fetchBlip = ({commit}, {spreadsheetId, blipId}) => {
//   const url = `${BACKEND_URL}/${spreadsheetId}/blips/${blipId}`
//
//   return fetch(url)
//     .then((response) => commit('UPDATE_BLIP_DETAILS', {response: response.json()}))
//     .catch((error) => commit('FETCH_BLIP_DETAILS_FAIL', {error: error.json()}))
// }
