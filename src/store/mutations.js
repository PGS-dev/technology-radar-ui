// Panels

export const OPEN_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = true
}

export const CLOSE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = false
}

export const TOGGLE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = !state[panelName].isOpen
}

// Radar details

export const GET_RADAR_DETAILS_REQUEST = (state) => {
  state.loaders.radarDetails = true
}

export const GET_RADAR_DETAILS_SUCCESS = (state, {response}) => {
  state.loaders.radarDetails = false
  state.radarDetails = response
}

export const GET_RADAR_DETAILS_FAIL = (state, {response}) => {
  state.loaders.radarDetails = false
  state.radarDetails = false
}

// Snapshots

export const GET_SNAPSHOTS_REQUEST = (state) => {
  state.loaders.snapshots = true
}

export const GET_SNAPSHOTS_SUCCESS = (state, {response}) => {
  state.loaders.snapshots = false
  state.snapshots = response
}

export const GET_SNAPSHOTS_FAIL = (state, {response}) => {
  state.loaders.snapshots = false
  state.snapshots = []
}

// All Blips

export const GET_BLIPS_REQUEST = (state) => {
  state.loaders.blips = true
}

export const GET_BLIPS_SUCCESS = (state, {response}) => {
  state.loaders.blips = false
  state.allBlips = response
}

export const GET_BLIPS_FAIL = (state, {response}) => {
  state.loaders.blips = false
  state.allBlips = false
}

// Snapshot

export const GET_SNAPSHOT_REQUEST = (state) => {
  state.loaders.snapshot = true
}

export const GET_SNAPSHOT_SUCCESS = (state, {response}) => {
  state.loaders.snapshot = false
  state.currentSnapshot = response
}

export const GET_SNAPSHOT_FAIL = (state, {response}) => {
  state.loaders.snapshot = false
  state.currentSnapshot = false
}

// Blip details

export const GET_BLIP_REQUEST = (state) => {
  state.loaders.blip = true
}

export const GET_BLIP_SUCCESS = (state, {response}) => {
  state.loaders.blip = false
  state.blipDetails = response
}

export const GET_BLIP_FAIL = (state, {response}) => {
  state.loaders.blips = false
  state.blipDetails = false
}
