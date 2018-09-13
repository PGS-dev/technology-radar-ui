<template>
  <section>
    <h1 class="name">{{blipId}}</h1>

    <md-spinner v-if="loader && !blipDetails" md-indeterminate></md-spinner>

    <div v-if="blipDetails && !loader">
      <h3 class="section">{{blipDetails.section}}</h3>
      <h4 class="status">{{blipDetails.status}}</h4>

      <p class="description" v-if="blipDetails.description" v-html="blipDetails.description"></p>

      <div class="history" v-if="blipDetails.history">
        <ul>
          <li v-for="(change, idx) in blipDetails.history" :key="idx">
            <router-link :to="`/${spreadsheetId}/${change.snapshotName}`" class="history-link">
              <span class="history-status">{{change.newStatus !== change.oldStatus ? change.newStatus : ''}}</span>
              <span class="history-snapshot">{{change.snapshotName}}</span>
              <p class="history-comment" v-if="change.comment">{{change.comment}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'blipPage',
    props: [
      'spreadsheetId',
      'blipId'
    ],
    computed: mapState({
      blipDetails: 'blipDetails',
      loader: state => state.loaders.blip
    }),
    mounted: function () {
      console.info('mounted, getBlipDetails')
      this.$store.dispatch('getBlipDetails', {
        spreadsheetId: this.spreadsheetId,
        blipId: this.blipId
      })
    }
  }
</script>

<style scoped>
  section {
    padding: 30px;
  }

  .name {
    text-align: center;
    font-weight: 100;
    font-size: 50px;
    margin-bottom: 0;
  }

  .section {
    text-align: center;
    font-weight: 100;
    font-size: 30px;

  }

  .status {
    text-align: center;
    font-weight: 100;
    font-size: 40px;
    color: #F57C00;
    margin: 50px 0;
  }

  .description {
    text-align: center;
    max-width: 600px;
    margin: 0px auto 30px;
  }

  .md-spinner {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -25px;
    margin-top: -25px;
  }

  .history {
    max-width: 300px;
    margin: 0 auto;
  }

  .history ul {
    list-style: none;
    border-left: solid 2px white;
    margin: 0;
    padding: 0 0 0 10px;
  }

  .history li::before {
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    border: solid 2px white;
    background: white;
    border-radius: 50%;
    vertical-align: middle;
    transform: translateX(-16px) translateY(-10px);
  }

  A.history-link {
    background: rgba(255,255,255, 0.5);
    padding: 15px 20px;
    display: inline-block;
    text-decoration: none;
    color: #333 !important;
    width: 250px;
    border-radius: 5px;
  }

  .history .history-link:hover {
    text-decoration: none;
    background: rgba(255,255,255, 1);
  }

  .history-status {
    display: block;
    font-size: 20px;
    text-decoration: none;
  }

  .history-snapshot {
    display: block;
    text-decoration: none;
  }

  .history-comment {
    color: #999;
    margin: 5px 0 0 0;
  }
</style>
