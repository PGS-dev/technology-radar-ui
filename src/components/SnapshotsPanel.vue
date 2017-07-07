<template>
  <md-sidenav class="md-left"
              ref="leftSidenav"
              :md-swipeable="isPanelSwipeable">
    <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">Snapshots</h3>
      </div>
    </md-toolbar>

    <p v-if="isLoading">Loading ...</p>
    <p v-if="snapshots === false">Cannot load snapshots :(</p>
    <nav>
      <md-list>
        <router-link
          v-for="snapshot in snapshots"
          :key="snapshot.name"
          :to="`/${spreadsheetId}/${snapshot.name}`"
          tag="md-list-item">
          {{snapshot.name}}
        </router-link>
      </md-list>

    </nav>
  </md-sidenav>
</template>

<script>
  import {mapState} from 'vuex'

  const panelName = 'snapshotsPanel'

  export default {
    name: panelName,
    props: [
      'isLoading',
      'snapshots'
    ],
    data: function () {
      return {
        isPanelSwipeable: true
      }
    },
    computed: mapState({
      spreadsheetId: state => state.spreadsheetId,
      snapshotsPanelIsOpen: state => state.snapshotsPanel.isOpen
    }),
    methods: {
      closePanel: function () {
        debugger
        this.$store.dispatch('closePanel', 'snapshotsPanel')
      }
    },
    watch: {
      snapshotsPanelIsOpen: function (newValue) {
        this.$refs.leftSidenav.toggle()
      }
    }
  }
</script>

<style scoped>
</style>
