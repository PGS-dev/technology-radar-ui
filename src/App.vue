<template>
  <div id="app">
    <app-header
      :radar-name="radarName"
      :spreadsheet-id="spreadsheetId"
      :snapshot-id="snapshotId">
    </app-header>
    <div>
      <aside>
        <snapshots-panel
          v-if="spreadsheetId"
          :spreadsheet-id="spreadsheetId"
          :snapshots="snapshots"
          :is-loading="loaders.snapshots">
        </snapshots-panel>
      </aside>
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
    computed: mapState({
      spreadsheetId: state => state.route.params.spreadsheetId,
      snapshotId: state => state.route.params.snapshotId,
      radarName: state => state.radarDetails.tittle,
      loaders: state => state.loaders,
//      snapshotsPanelProps: state => state.snapshotsPanel,
//      detailsPanelProps: state => state.detailsPanel,
      snapshots: state => state.snapshots,
      blipDetails: state => state.blipDetails
    }),
    mounted: function () {
      if (this.spreadsheetId) {
        this.$store.dispatch('getRadarDetails', this.spreadsheetId)
        this.$store.dispatch('getSnapshots', this.spreadsheetId)
      }
    },
    watch: {
      spreadsheetId: function (newValue) {
        this.$store.dispatch('getRadarDetails', newValue)
        this.$store.dispatch('getSnapshots', newValue)
      }
    }
  }
</script>

<style>
  html,
  body {
    height: 100%;
    /*overflow: hidden;*/
    color: #333;
  }

  #app {
    min-height: 100%;
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  }

  app-header {
    position: fixed;
  }
</style>
