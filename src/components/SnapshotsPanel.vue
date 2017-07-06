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
    })
  }
</script>

<style scoped>
  section {
    text-align: center;
    display: none;
  }

  section.is-open {
    display: block;
  }

</style>
