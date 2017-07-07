<template>
  <div id="app">
    <app-header :radar-name="radarName"></app-header>
    <div>
      <md-sidenav class="md-left"
                  ref="leftSidenav"
                  :md-swipeable="isPanelSwipeable">
        <snapshots-panel
          :snapshots="snapshots"
          :is-loading="loaders.snapshots">
        </snapshots-panel>
      </md-sidenav>
      <main>
        <router-view></router-view>
      </main>
    </div>

    <aside>
      <!--<details-panel-->
      <!--:is-open="detailsPanelProps.isOpen"-->
      <!--:name="'NAME'"-->
      <!--:section="'SECTION'"-->
      <!--:status="'STATUS'"-->
      <!--:previousStatus="'PREVSTATUS'"-->
      <!--:history="[{status: 'adopt'}]"-->
      <!--:description="'DESC'">-->
      <!--</details-panel>-->
    </aside>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import AppHeader from '@/components/AppHeader'
  import SnapshotsPanel from '@/components/SnapshotsPanel'
  import DetailsPanel from '@/components/DetailsPanel'

  export default {
    name: 'app',
    components: {
      AppHeader,
      SnapshotsPanel,
      DetailsPanel
    },
    data: function () {
      return {
        isPanelSwipeable: true
      }
    },
    computed: mapState({
      spreadsheetId: state => state.spreadsheetId,
      radarName: state => state.radarDetails.tittle,
      loaders: state => state.loaders,
      snapshotsPanelProps: state => state.snapshotsPanel,
      snapshotsPanelIsOpen: state => state.snapshotsPanel.isOpen,
      detailsPanelProps: state => state.detailsPanel,
      snapshots: state => state.snapshots,
      blipDetails: state => state.blipDetails
    }),
    mounted: function () {
      this.$store.dispatch('getRadarDetails', this.spreadsheetId)
      this.$store.dispatch('getSnapshots', this.spreadsheetId)
    },
    watch: {
      snapshotsPanelIsOpen: function (newValue) {
        this.$refs.leftSidenav.toggle()
      }
    }
  }
</script>

<style>
  html,
  body {
    height: 100%;
    /*overflow: hidden;*/
  }

  main {
    padding: 0 10px;
  }

  app-header {
    position: fixed;
  }
</style>
