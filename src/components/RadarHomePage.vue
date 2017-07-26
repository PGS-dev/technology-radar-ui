<template>
  <div>
    <h1>{{radarName}}</h1>
    <div class="u-textCenter">
      <h2>Current state</h2>
      <p>See all blips in current state - even theese which wasn`t changed for a long time</p>
      <router-link
        :to="`/${spreadsheetId}/overview`"
        class="md-default md-raised"
        tag="md-button">
        Overview
      </router-link>
    </div>
    <div class="u-textCenter">
      <h2>Snapshots</h2>
      <p>See blips added or updated since last two snapshots</p>
      <router-link
        v-for="snapshot in snapshots"
        :key="snapshot.name"
        :to="`/${spreadsheetId}/${snapshot.name}`"
        tag="md-button"
        class="md-default md-raised">
        {{snapshot.name}}
      </router-link>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'radarHomePage',
    props: [
      'spreadsheetId'
    ],
    computed: mapState({
      snapshots: state => state.snapshots,
      radarName: state => state.radarDetails.tittle
    })
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    text-align: center;
    margin: 100px 0;
    font-weight: 100;
    font-size: 50px;
  }

  h2 {
    text-align: center;
    font-weight: 100;
    margin: 80px 0 0;
    font-size: 30px;
  }

  p {
    color: #999;
  }

  .u-textCenter {
    text-align: center;
  }
</style>
