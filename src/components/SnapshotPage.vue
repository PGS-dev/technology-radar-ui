<template>
  <section>
    <md-tabs md-fixed class="md-transparent">
      <md-tab id="chart" md-label="Chart">
        <radar v-if="currentSnapshot && currentSnapshot.blips" :radar-data="currentSnapshot"></radar>
      </md-tab>

      <md-tab id="table" md-label="Table">
        <blips-table v-if="currentSnapshot.blips" :blips="currentSnapshot.blips" :spreadsheet-id="spreadsheetId"></blips-table>
      </md-tab>
    </md-tabs>
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

</style>
