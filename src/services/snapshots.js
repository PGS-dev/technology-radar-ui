const BACKEND_URL = 'https://techradar-api.pgs-soft.com/api/radars'

export const getSnapshots = (spreadsheetId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots`
  return fetch(url).then(response => response.json())
    .catch(m => console.log(m))
}

export const getBlips = (spreadsheetId, snapshotId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`
  return fetch(url).then(response => response.json())
    .catch(m => console.log(m))
}

export const getBlipDetails = (spreadsheetId, blipId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips/${blipId}`
  return fetch(url).then(response => response.json())
    .catch(m => console.log(m))
}
