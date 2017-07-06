export const OPEN_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = true
}

export const CLOSE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = false
}

export const TOGGLE_PANEL = (state, {panelName}) => {
  state[panelName].isOpen = !state[panelName].isOpen
}
