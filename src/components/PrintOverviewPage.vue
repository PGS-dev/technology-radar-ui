<template>
  <section>
    <main>
      <radar v-if="currentSnapshot && currentSnapshot.blips"
             :radar-data="currentSnapshot"
             :spreadsheet-id="spreadsheetId">
      </radar>
    </main>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import PrintRadar from './PrintRadar'

  export default {
    name: 'overviewPage',
    components: {
      'radar': PrintRadar
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
  SECTION  {
    background: white;
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    align-content: stretch;
  }
</style>
