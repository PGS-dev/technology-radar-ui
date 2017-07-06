<template>
  <table>
    <thead>
    <th>Name</th>
    <th>Section</th>
    <th>Status</th>
    <th>Prev Status</th>
    <th>State</th>
    </thead>

    <tbody>
    <tr v-for="blip in blips">
      <td>{{blip.name}}</td>
      <td>{{blip.section}}</td>
      <td>{{blip.status}}</td>
      <td>{{blip.previousStatus}}</td>
      <td>{{blip.state}}</td>
    </tr>
    </tbody>
  </table>
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
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    background: darkgrey;
    padding: 10px;
  }

  td {
    border-bottom: solid 1px darkgrey;
    padding: 10px;
  }
</style>
