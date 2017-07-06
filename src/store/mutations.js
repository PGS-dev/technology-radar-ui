export const OPEN_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = true
}

export const CLOSE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = false
}

export const TOGGLE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = !state[panelName].isOpen
}

export const FETCH_SNAPSHOTS = (state) => {
  state.snapshotsPanel.isLoading = true
}

export const FETCH_SNAPSHOTS_SUCCESS = (state, {response}) => {
  state.snapshotsPanel.isLoading = false
  state.snapshots = response
}
