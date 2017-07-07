<template>
  <div>
    <h1>{{ msg }}</h1>

    <md-toolbar md-theme="white">
      <span class="md-title">Example radars</span>
    </md-toolbar>

    <md-list>
      <md-list-item>
        <router-link to="/11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc/">Frontend Radar</router-link>
      </md-list-item>
      <md-list-item>
        <router-link to="/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg/">Example Radar</router-link>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
export default {
  name: 'homePage',
  data () {
    return {
      msg: 'Welcome to Technology Radar App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  text-align: center;
}
</style>
