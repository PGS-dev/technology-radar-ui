<template>
  <section v-bind:class="{ 'is-open': isOpen}">
    <article>
      <header>{{name}}</header>
      <div>{{section}}</div>
      <p>{{description}}</p>
    </article>
    <div>
      <ul>
        <li v-for="change in history">{{change}}</li>
      </ul>
    </div>
    <button @click="togglePanel"> <<</button>
  </section>
</template>

<script>
  const panelName = 'detailsPanel'

  export default {
    name: panelName,
    props: [
      'isOpen',
      'name',
      'status',
      'previousStatus',
      'section',
      'description',
      'history'
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
    right: 0;
    width: 100px;
    background: rgba(0, 0, 0, 0.3);
    padding: 30px;
    transform: translateX(100%);
    transition: transform 0.5s;
  }

  section.is-open {
    background: red;
    transform: translateX(0);
  }

  button {
    position: absolute;
    left: -30px;
    top: 0;
    display: block;
    width: 30px;
    height: 30px;
    background: #666;
    padding: 0;
    border: 0;
    cursor: pointer;
  }

  button:hover {
    background: orange;
  }
</style>
