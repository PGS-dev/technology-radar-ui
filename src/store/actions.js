import {
  fetchSnapshots,
  fetchSnapshot,
  fetchRadarDetails,
  fetchAllBlips
} from '../services/snapshots'

export const setSpreadsheetId = ({commit}, spreadsheetId) => {
  commit('SET_SPREADSHEET_ID', {spreadsheetId})
}

export const openPanel = ({commit}, panelName) => {
  commit('OPEN_PANEL', {panelName})
}

export const closePanel = ({commit}, panelName) => {
  commit('CLOSE_PANEL', {panelName})
}

export const togglePanel = ({commit}, panelName) => {
  commit('TOGGLE_PANEL', {panelName})
}

export const getRadarDetails = ({commit}, spreadsheetId) => {
  commit('GET_RADAR_DETAILS_REQUEST')

  return fetchRadarDetails(spreadsheetId)
    .then((response) => {
      commit('GET_RADAR_DETAILS_SUCCESS', {response})
    })
    .catch((error) => {
      commit('GET_RADAR_DETAILS_FAIL', {error})
    })
}

export const getSnapshots = ({commit}, spreadsheetId) => {
  commit('GET_SNAPSHOTS_REQUEST')

  return fetchSnapshots(spreadsheetId)
    .then((response) => {
      commit('GET_SNAPSHOTS_SUCCESS', {response})
    })
    .catch((error) => {
      commit('GET_SNAPSHOTS_FAIL', {error})
    })
}

export const getSnapshot = ({commit}, {spreadsheetId, snapshotId}) => {
  commit('GET_SNAPSHOT_REQUEST')

  return fetchSnapshot(spreadsheetId, snapshotId)
    .then((response) => {
      commit('GET_SNAPSHOT_SUCCESS', {response})
    })
    .catch((error) => {
      commit('GET_SNAPSHOT_FAIL', {error})
    })
}

export const getAllBlips = ({commit}, spreadsheetId) => {
  commit('GET_BLIPS_REQUEST')

  return fetchAllBlips(spreadsheetId)
    .then((response) => {
      commit('GET_BLIPS_SUCCESS', {response})
    })
    .catch((error) => {
      commit('GET_BLIPS_FAIL', {error})
    })
}
