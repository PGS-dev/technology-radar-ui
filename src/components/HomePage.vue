<template>
  <div>
    <h1>Visualize Your Technology Radar</h1>

    <div class="u-center">
      <form novalidate @submit.stop.prevent="submit">
        <md-input-container>
          <label>Enter Google Spreadsheet ID</label>
          <md-input v-model="inputSpreadsheetId"></md-input>
        </md-input-container>

        <md-button type="submit" class="md-primary md-raised">
          OPEN RADAR
        </md-button>
      </form>

      <div class="template">
        <h3>Don't have spreadsheet yet?</h3>
        <p>You can use <a :href="spreasheetTemplateURL" target="_blank">this template</a> to create your own</p>
      </div>

      <div class="examples">
        <p>Or try sample radars:</p>
        <router-link
          to="/11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc/"
          tag="md-button"
          class="md-default md-raised">
          PGS Frontend Radar
        </router-link>
        <router-link
          to="/19eUTAQ-jJN9Wec8J0MqvBX2jPX9tG1Ncs-9i7DqP-AQ/"
          tag="md-button"
          class="md-default md-raised">
          PGS .NET Radar
        </router-link>
        <router-link
          to="/1nXvauhn5ZA3IKcr-l1Aei2w9IXNmX-QtWwfa7pWhdu8/"
          tag="md-button"
          class="md-default md-raised">
          PGS Java Radar
        </router-link>
        <router-link
          to="/1OGNQiG5YR-9kJNPrYSf1GK_CAUG_rdSV7LPtdKyrxVw/"
          tag="md-button"
          class="md-default md-raised">
          PGS PHP Radar
        </router-link>
        <router-link
          to="/1SiCskPVGV3v1yL977vMxeoZNe0Jbj45GDAZRszJQzvY/"
          tag="md-button"
          class="md-default md-raised">
          PGS QA Radar
        </router-link>
        <router-link
          to="/1hVJMnhZ8IMsMAOGkxm0PwE-NIrE1korWXaN0ol_mUCQ/"
          tag="md-button"
          class="md-default md-raised">
          PGS BA Radar
        </router-link>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'homePage',
    data () {
      return {
        msg: 'Welcome to Technology Radar App',
        inputSpreadsheetId: '11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc',
        spreasheetTemplateURL: 'https://docs.google.com/spreadsheets/d/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg/edit?usp=sharing'
      }
    },
    methods: {
      submit: function () {
        this.$router.push({
          name: 'RadarHomePage',
          params: {
            spreadsheetId: this.inputSpreadsheetId
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    text-align: center;
    margin: 100px 0;
    font-weight: 100;
    font-size: 50px;
  }

  form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }

  .u-center {
    text-align: center;
  }

  .template {
    margin-top: 50px;
  }

  .template a {
    color: #f57c00;
  }

  .examples {
    margin-top: 100px;
  }
</style>
