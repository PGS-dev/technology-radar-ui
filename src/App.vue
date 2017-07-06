<template>
  <div id="app">
    <app-header></app-header>
    <main>
      <router-view></router-view>
    </main>
    <aside>
      <snapshots-panel></snapshots-panel>
    </aside>
    <aside>
      <details-panel></details-panel>
    </aside>
  </div>
</template>

<script>
  import AppHeader from '@/components/AppHeader'
  import SnapshotsPanel from '@/components/SnapshotsPanel'
  import DetailsPanel from '@/components/DetailsPanel'

  export default {
    name: 'app',
    components: {
      AppHeader,
      SnapshotsPanel,
      DetailsPanel
    }
  }
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
