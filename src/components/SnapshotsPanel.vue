<template>
  <section v-bind:class="{ 'is-open': isOpen}">
    <p v-if="isLoading">Loading ...</p>
    <p v-if="snapshots === false">Cannot load snapshots :(</p>
    <nav>
      <router-link
        v-for="snapshot in snapshots"
        :key="snapshot.name"
        :to="`/${spreadsheetId}/${snapshot.name}`"
        tag="md-button">
        {{snapshot.name}}
      </router-link>
    </nav>

    <!--<md-button @click="togglePanel">Toggle</md-button>-->
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
  nav {
    text-align: center;
  }

</style>
