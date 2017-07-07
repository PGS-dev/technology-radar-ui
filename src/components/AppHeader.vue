<template>
  <md-toolbar>
    <md-button v-if="spreadsheetId" class="md-icon-button" @click="toggleSnapshotsPanel">
      <md-icon>menu</md-icon>
    </md-button>

    <router-link :to="`/${spreadsheetId}`" tag="h2" class="md-title" style="flex: 1">
      {{radarName}} <span class="snapshotName" v-if="snapshotId"> / {{snapshotId}}</span>
    </router-link>

    <md-button v-if="spreadsheetId" @click="toggleSnapshotsPanel" >Snapshots</md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'appHeader',
    props: [
      'radarName',
      'spreadsheetId',
      'snapshotId'
    ],
    methods: {
      toggleSnapshotsPanel: function () {
        this.$store.dispatch('togglePanel', 'snapshotsPanel')
      }
    }
  }
</script>

<style scoped>
  .md-title {
    cursor: pointer;
  }

  .snapshotName {
    /*font-size: 80%;*/
  }
</style>
