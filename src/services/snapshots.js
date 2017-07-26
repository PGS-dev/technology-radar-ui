import * as _ from 'lodash'

const BACKEND_URL = 'https://techradar-api.pgs-soft.com/api/radars'

const defaultFetchMethod = (url) =>
  fetch(url)
    .then(response => response.json())
    .catch(error => console.warn(error))

export const fetchRadarDetails = (spreadsheetId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}`
  return defaultFetchMethod(url)
}

export const fetchSnapshots = (spreadsheetId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots`
  return defaultFetchMethod(url)
}

export const fetchAllBlips = async (spreadsheetId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips`

  // TODO: This should be delivered by backend in one request...
  const spreadsheetsCollection = await fetchSnapshots(spreadsheetId)
  const firstSpreadsheetData = await fetchSnapshot(spreadsheetId, _.result(spreadsheetsCollection, '[0].name'))
  const allBlipsCollection = await defaultFetchMethod(url)
  const output = {
    statuses: _.result(firstSpreadsheetData, 'statuses'),
    sections: _.result(firstSpreadsheetData, 'sections'),
    blips: allBlipsCollection
  }

  return output
}

export const fetchSnapshot = (spreadsheetId, snapshotId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`
  return defaultFetchMethod(url)
}

export const fetchBlipDetails = (spreadsheetId, blipId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips/${blipId}`
  return defaultFetchMethod(url)
}
