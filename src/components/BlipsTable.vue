<template>
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Section</md-table-head>
        <md-table-head>Status</md-table-head>
        <md-table-head>Previous</md-table-head>
        <md-table-head>State</md-table-head>
      </md-table-row>
    </md-table-header>

    <md-table-body>
      <md-table-row v-for="blip in blips" :key="blip.name">
        <md-table-cell>{{blip.name}}</md-table-cell>
        <md-table-cell>{{blip.section}}</md-table-cell>
        <md-table-cell>{{blip.status}}</md-table-cell>
        <md-table-cell>{{blip.previousStatus}}</md-table-cell>
        <md-table-cell>{{blip.state}}</md-table-cell>
      </md-table-row>
    </md-table-body>
  </md-table>

</template>

<script>
  export default {
    name: 'blipsTable',
    props: [
      'blips'
    ]
  }
</script>

<style scoped>
</style>
