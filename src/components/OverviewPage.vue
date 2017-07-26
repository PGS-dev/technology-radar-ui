<template>
  <section>
    <md-tabs md-fixed class="md-transparent">
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
    name: 'overviewPage',
    components: {
      'blipsTable': BlipsTable,
      'radar': Radar
    },
    props: [
      'spreadsheetId'
    ],
    computed: mapState({
      loader: state => state.loaders.snapshot,
      currentSnapshot: state => state.allBlips
    }),
    mounted: function () {
      this.$store.dispatch('getAllBlips', {spreadsheetId: this.spreadsheetId})
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
