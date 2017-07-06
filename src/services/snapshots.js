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

export const fetchAllBlips = (spreadsheetId, snapshotId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips`
  return defaultFetchMethod(url)
}

export const fetchSnapshot = (spreadsheetId, snapshotId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`
  return defaultFetchMethod(url)
}

export const fetchBlipDetails = (spreadsheetId, blipId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips/${blipId}`
  return defaultFetchMethod(url)
}
