<template>

  <section>
    <h2>{{spreadsheetId}} / {{snapshotId}}</h2>
    <p v-if="currentSnapshot.blips">Blips: {{currentSnapshot.blips.length}}</p>

    <blips-table v-if="currentSnapshot.blips" :blips="currentSnapshot.blips"></blips-table>

  </section>

</template>

<script>
  import {mapState} from 'vuex'
  import BlipsTable from './BlipsTable'

  export default {
    name: 'snapshotPage',
    components: {
      'blipsTable': BlipsTable
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
