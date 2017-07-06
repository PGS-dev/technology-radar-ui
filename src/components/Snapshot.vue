<template>

  <section>
    <pre>{{snapshotData}}</pre>
  </section>

</template>

<script>
  export default {
    name: 'snapshot',
    data () {
      return {
        snapshotData: {
          blips: []
        }
      }
    }
  }
</script>

<style scoped>

</style>
