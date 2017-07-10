<template>
  <section>
    <md-tabs md-fixed class="">
      <md-tab id="chart" md-label="Chart">
        <radar v-if="currentSnapshot && currentSnapshot.blips"
               :radar-data="currentSnapshot"
               :spreadsheet-id="spreadsheetId">
        </radar>
      </md-tab>

      <md-tab id="table" md-label="Table">
        <blips-table v-if="currentSnapshot && currentSnapshot.blips"
                     :blips="currentSnapshot.blips"
                     :spreadsheet-id="spreadsheetId">
        </blips-table>
      </md-tab>
    </md-tabs>

    <md-spinner v-if="loader" md-indeterminate></md-spinner>

  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import BlipsTable from './BlipsTable'
  import Radar from './Radar'

  export default {
    name: 'snapshotPage',
    components: {
      'blipsTable': BlipsTable,
      'radar': Radar
    },
    props: [
      'spreadsheetId',
      'snapshotId'
    ],
    computed: mapState({
      loader: state => state.loaders.snapshot,
      currentSnapshot: state => state.currentSnapshot
    }),
    mounted: function () {
      this.$store.dispatch('getSnapshot', {spreadsheetId: this.spreadsheetId, snapshotId: this.snapshotId})
    },
    watch: {
      snapshotId: function () {
        this.$store.dispatch('getSnapshot', {spreadsheetId: this.spreadsheetId, snapshotId: this.snapshotId})
      }
    }
  }
</script>

<style scoped>
  .md-spinner {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -25px;
  }

  .md-tab-header-container > span {
    color: red
  }
</style>
