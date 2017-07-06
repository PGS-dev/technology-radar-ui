<template>
  <md-toolbar>
    <!--<md-button class="md-icon-button">-->
      <!--<md-icon>menu</md-icon>-->
    <!--</md-button>-->

    <router-link to="/" tag="h2" class="md-title" style="flex: 1">
      {{radarName}}
    </router-link>


    <!--<md-button>Snapshots</md-button>-->
    <!--<md-button>All blips</md-button>-->
  </md-toolbar>
</template>

<script>
  export default {
    name: 'appHeader',
    props: [
      'radarName'
    ]
  }
</script>

<style scoped>
  .md-title {
    cursor: pointer;
  }
</style>
