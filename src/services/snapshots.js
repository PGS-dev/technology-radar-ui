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

export const fetchAllBlips = (spreadsheetId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips`

  // TODO: This should be delivered by backend in one request...
  let p1 = new Promise(resolve => {
    // Fetch snapshots, then fetch first snapshot just for statuses and sections
    fetchSnapshots(spreadsheetId)
      .then(snapshotsResponse => {
        fetchSnapshot(spreadsheetId, _.result(snapshotsResponse, '[0].name'))
          .then(snap => {
            resolve({
              statuses: snap.statuses,
              sections: snap.sections
            })
          })
      })
  })

  let p2 = new Promise(resolve => {
    // Fetch all blips
    defaultFetchMethod(url).then(response => resolve({blips: response}))
  })

  return Promise
    .all([p1, p2])
    .then(responses => Object.assign(responses[0], responses[1]))
}

export const fetchSnapshot = (spreadsheetId, snapshotId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`
  return defaultFetchMethod(url)
}

export const fetchBlipDetails = (spreadsheetId, blipId) => {
  const url = `${BACKEND_URL}/${spreadsheetId}/blips/${blipId}`
  return defaultFetchMethod(url)
}
