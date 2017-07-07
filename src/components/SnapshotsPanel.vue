<template>
  <section>
    <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">Snapshots</h3>
      </div>
    </md-toolbar>

    <p v-if="isLoading">Loading ...</p>
    <p v-if="snapshots === false">Cannot load snapshots :(</p>
    <nav>
      <md-list>
        <router-link
          v-for="snapshot in snapshots"
          :key="snapshot.name"
          :to="`/${spreadsheetId}/${snapshot.name}`"
          tag="md-list-item">
          {{snapshot.name}}
        </router-link>
      </md-list>

    </nav>
  </section>
</template>

<script>
  import {mapState} from 'vuex'

  const panelName = 'snapshotsPanel'

  export default {
    name: panelName,
    props: [
      'isLoading',
      'snapshots'
    ],
    computed: mapState({
      spreadsheetId: state => state.spreadsheetId
    }),
    methods: {
      closePanel: function () {
        debugger
        this.$store.dispatch('closePanel', 'snapshotsPanel')
      }
    }
  }
</script>

<style scoped>
</style>
