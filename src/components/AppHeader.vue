<template>
  <md-toolbar>
    <md-button class="md-icon-button" @click="toggleSnapshotsPanel">
      <md-icon>menu</md-icon>
    </md-button>

    <router-link to="/" tag="h2" class="md-title" style="flex: 1">
      {{radarName}}
    </router-link>


    <md-button @click="toggleSnapshotsPanel" >Snapshots</md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'appHeader',
    props: [
      'radarName'
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
</style>
