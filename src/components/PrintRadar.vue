<template>
  <svg id="radar" class="RadarChart scaling-svg" viewBox="0 0 1000 1000"></svg>
</template>

<script>
  import Chart from './../assets/chart'

  export default {
    name: 'radar',
    props: [
      'radarData',
      'spreadsheetId'
    ],
    data () {
      return {}
    },
    mounted: function () {
      const options = {
        debug: this.$route.query.debug === 'true', // do NOT typecast string bool
        limit: this.$route.query.limit
      }

      let radar = new Chart(this.$el, this.radarData, this.onBlipClick, options)
      radar.init()
    },
    watch: {
      radarData: function () {
        // @TODO: implement update pattern without clearing out svg elements;
        // @TODO: add some animation upon update

        this.$el.innerHTML = ''
        let radar = new Chart(this.$el, this.radarData, this.onBlipClick)
        radar.init()
      }
    }
  }

</script>

<style lang="scss">
  .scaling-svg-container {
    position: relative;
    height: 0;
    width: 100%;
    padding: 0;
    padding-bottom: 100%;
  }

  .scaling-svg {
    max-height: 95vh;
    margin-top: -16px;
  }

  .itemLabel,
  .legendLabel,
  .areaLabel {
    font-family: 'Oswald', sans-serif;
    opacity: 1;
    transform-origin: top right;
    -moz-transform-origin: 0 0;
  }

  .areaFill {
    opacity: 0.5;
  }

  .areaLabel {
    fill: rgba(255, 255, 255, 0.7);
  }

  .legendLabel {
    font-style: normal;
    fill: #333;
  }

  .legendArcBg {
    /*fill: red;*/
    fill: transparent;
  }

  .legendArcOuter {
    fill: rgba(0, 0, 0, 0.1);
  }

  .RadarChart {
    .ItemLabel {
      cursor: default;
      fill: #333;
    }

    .Section--labelArc {
      fill: none;
    }

    .areaLabel {
      fill: rgba(255, 255, 255, 0.7);
    }
  }

  .RadarChart.debug {
    .Legend-background {
      stroke: magenta;
    }
    .Legend-arcOuter {
      stroke: cyan;
    }
    .Legend-innerPath {
      stroke: deeppink;
    }
    .Section--labelArc {
      fill: none;
      stroke: red;
      stroke-dasharray: 5 5;
      stroke-width: 5;
    }

  }

  .RadarChar-debug {
    stroke: red;

    .cyan {
      stroke: cyan;
    }

    .angleStep {
      stroke: blue;
    }
  }

</style>
