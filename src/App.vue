<template>
  <div id="app">
    <app-header></app-header>
    <main>
      <router-view></router-view>
    </main>
    <aside>
      snapshots:{{snapshots}}
      <snapshots-panel
        v-bind:snapshots="snapshots"
        v-bind:is-loading="snapshotsPanelProps.isLoading"
        v-bind:is-open="snapshotsPanelProps.isOpen">
      </snapshots-panel>
    </aside>
    <aside>
      <details-panel
        v-bind:is-open="detailsPanelProps.isOpen"
        v-bind:name="'NAME'"
        v-bind:section="'SECTION'"
        v-bind:status="'STATUS'"
        v-bind:previousStatus="'PREVSTATUS'"
        v-bind:history="[{status: 'adopt'}]"
        v-bind:description="'DESC'">
      </details-panel>
    </aside>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import AppHeader from '@/components/AppHeader'
  import SnapshotsPanel from '@/components/SnapshotsPanel'
  import DetailsPanel from '@/components/DetailsPanel'

  const spreadsheetId = '11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc'

  export default {
    name: 'app',
    components: {
      AppHeader,
      SnapshotsPanel,
      DetailsPanel
    },
    computed: mapState({
      snapshotsPanelProps: state => state.snapshotsPanel,
      detailsPanelProps: state => state.detailsPanel,
      snapshots: state => state.snapshots,
      blipDetails: state => state.blipDetails
    }),
    mounted: function () {
      this.$store.dispatch('fetchSnapshots', spreadsheetId)
    }
  }
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
