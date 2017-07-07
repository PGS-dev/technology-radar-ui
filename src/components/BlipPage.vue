<template>
  <section>
    <h1>{{blipId}}</h1>
    <div v-if="!loaders.blip">
      <h3>Section: {{blipDetails.section}}</h3>
      <h4>Current status: {{blipDetails.status}}</h4>

      <md-table v-if="blipDetails.history">
        <md-table-header>
          <md-table-row>
            <md-table-head>New status</md-table-head>
            <md-table-head>Old status</md-table-head>
            <md-table-head>Snapshot</md-table-head>
          </md-table-row>
        </md-table-header>
        <md-table-body>
          <md-table-row v-for="(change, idx) in blipDetails.history" :key="idx">
            <md-table-cell>{{change.newStatus}}</md-table-cell>
            <md-table-cell>{{change.oldStatus}}</md-table-cell>
            <md-table-cell><router-link :to="`/${spreadsheetId}/${change.snapshotName}`">{{change.snapshotName}}</router-link></md-table-cell>
          </md-table-row>
        </md-table-body>

      </md-table>
    </div>

    <md-spinner v-if="loaders.blip" md-indeterminate></md-spinner>
  </section>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'blipPage',
    props: [
      'spreadsheetId',
      'blipId'
    ],
    computed: mapState({
      blipDetails: state => state.blipDetails,
      loaders: state => state.loaders
    }),
    mounted: function () {
      this.$store.dispatch('getBlipDetails', {spreadsheetId: this.spreadsheetId, blipId: this.blipId})
    }
  }
</script>

<style scoped>
  section {
    padding: 30px;
  }
  .md-spinner {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -25px;
  }
  .md-table {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
