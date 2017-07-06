export const openPanel = ({commit}, panelName) => {
  commit('OPEN_PANEL', {panelName})
}

export const closePanel = ({commit}, panelName) => {
  commit('CLOSE_PANEL', {panelName})
}

export const togglePanel = ({commit}, panelName) => {
  commit('TOGGLE_PANEL', {panelName})
}
