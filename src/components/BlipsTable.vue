<template>
  <md-whiteframe class="tableContainer" v-if="blips">
    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>
            <input class="filter" placeholder="Name..." v-model="nameFilter"/>
          </md-table-head>
          <md-table-head>Section</md-table-head>
          <md-table-head>Status</md-table-head>
          <md-table-head>Previous</md-table-head>
          <md-table-head>State</md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="blip in filteredBlips" :key="blip.name">
          <md-table-cell>
            <router-link :to="`/${spreadsheetId}/blip/${blip.name}`">{{blip.name}}</router-link>
          </md-table-cell>
          <md-table-cell>{{blip.section}}</md-table-cell>
          <md-table-cell>{{blip.status}}</md-table-cell>
          <md-table-cell>{{blip.previousStatus}}</md-table-cell>
          <md-table-cell>{{blip.state}}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
  </md-whiteframe>
</template>

<script>
  export default {
    name: 'blipsTable',
    props: [
      'blips',
      'spreadsheetId'
    ],
    data: () => {
      return {
        nameFilter: ''
      }
    },
    computed: {
      filteredBlips: (vm) => {
        let query = vm.nameFilter.toLowerCase()
        if (query.length) {
          return vm.blips.filter((blip) => blip.name.toLowerCase().indexOf(query) >= 0)
        } else {
          return vm.blips
        }
      }
    }
  }
</script>

<style scoped>
  .tableContainer {
    background: rgba(255, 255, 255, 0.5);
    max-width: 900px;
    margin: 0 auto;
  }

  .tableContainer .md-table tbody .md-table-row {
    border-top-color: rgba(255, 255, 255, 0.1)
  }

  .tableContainer .md-table tbody .md-table-row:nth-child(1) {
    background: #eee;
  }

  input.filter {
    border: none;
    background: none;
    font-weight: bold;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.54);
  }

  input:focus {
    outline: none;
  }
</style>
