<template>
  <section>
    <md-tabs md-fixed class="md-transparent">
      <md-tab id="chart" md-label="Chart">
        <radar v-if="allBlips && allBlips.blips"
               :radar-data="allBlips"
               :spreadsheet-id="spreadsheetId">
        </radar>
      </md-tab>

      <md-tab id="table" md-label="Table">
        <blips-table v-if="allBlips && allBlips.blips"
                     :blips="allBlips.blips"
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
    name: 'radarHomePage',
    components: {
      'blipsTable': BlipsTable,
      'radar': Radar
    },
    props: [
      'spreadsheetId'
    ],
    computed: mapState({
      allBlips: state => state.allBlips
    }),
    mounted: function () {
      this.$store.dispatch('getAllBlips', {spreadsheetId: this.spreadsheetId})
    }
  }
</script>
