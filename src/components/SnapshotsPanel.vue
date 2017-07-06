<template>
  <section v-bind:class="{ 'is-open': isOpen}">
    <p v-if="isLoading">Loading ...</p>
    <nav>
      <ul>
        <li v-for="snapshot in snapshots">
          <a href="">{{snapshot.name}}</a>
        </li>
      </ul>
    </nav>
    <button @click="togglePanel">Toggle</button>
  </section>
</template>

<script>
  const panelName = 'snapshotsPanel'

  export default {
    name: panelName,
    props: [
      'isOpen',
      'isLoading',
      'snapshots'
    ],
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

  section.is-open {
    background: red;
    transform: translateX(0);
  }
</style>
