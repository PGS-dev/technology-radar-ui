<template>
  <header>
    <router-link to="/">{{radarName}}</router-link>
  </header>
</template>

<script>
  export default {
    name: 'appHeader',
    props: [
      'radarName'
    ]
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

  a {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
    color: white;
    text-decoration: none;
  }

  a:hover {
    color: orange;
  }

</style>
