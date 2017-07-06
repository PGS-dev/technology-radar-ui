<template>
  <header>
    <span>{{radarName}}</span>
  </header>
</template>

<script>
  export default {
    name: 'appHeader',
    data () {
      return {
        radarName: `Technology Radar`
      }
    }
  }
</script>

<style scoped>
  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #333;
    color: #ffffff;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
</style>
