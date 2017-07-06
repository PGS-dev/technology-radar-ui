<template>
  <section>
    isOpen: {{isOpen}}
    <nav>
      <ul>
        <li v-for="snap in snapshotsCollection">
          <a href="">{{snap}}</a>
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
    computed: mapState({
      isOpen: state => state[panelName].isOpen,
      snapshotsCollection: state => []
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
    position: absolute;
    top: 56px;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    padding: 30px;
  }
</style>
