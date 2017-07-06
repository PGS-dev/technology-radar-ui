<template>
  <section v-bind:class="{ 'is-open': isOpen}">
    <p v-if="isLoading">Loading ...</p>
    <p v-if="snapshots === false">Cannot load snapshots :(</p>
    <nav>
      <ul>
        <li v-for="snapshot in snapshots">
          <!--<a href="">{{snapshot.name}}</a>-->
          <router-link :to="`/${spreadsheetId}/${snapshot.name}`">{{snapshot.name}}</router-link>
        </li>
      </ul>
    </nav>
    <button @click="togglePanel">Toggle</button>
  </section>
</template>

<script>
  import {mapState} from 'vuex'

  const panelName = 'snapshotsPanel'

  export default {
    name: panelName,
    props: [
      'isOpen',
      'isLoading',
      'snapshots'
    ],
    computed: mapState({
      spreadsheetId: state => state.spreadsheetId
    }),
    methods: {
      togglePanel: function () {
        this.$store.dispatch('togglePanel', panelName)
      }
    }
  }
</script>

<style scoped>
  section {
    position: relative;
  }

  section.is-open {
    opacity: 0.5;
  }

  ul,li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
  }

  a {
    text-decoration: none;
    display: inline-block;
    padding: 10px;
    color: #333;
    transition: background 0.4s;
  }

  a:hover, a.router-link-active {
    background: #333;
    color: white;
  }



  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
