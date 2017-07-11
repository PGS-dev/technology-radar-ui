<template>
  <div>
    <h1>{{radarName}}</h1>
    <div class="snapshots">
      <router-link
        v-for="snapshot in snapshots"
        :key="snapshot.name"
        :to="`/${spreadsheetId}/${snapshot.name}`"
        tag="md-button">
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

  .snapshots {
    text-align: center;
  }
</style>
