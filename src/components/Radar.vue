<template>
    <svg id="radar" class="scaling-svg" viewBox="0 0 1000 1000"></svg>
</template>

<script>
  import Chart from './../assets/chart'

  export default {
    name: 'radar',
    props: [
      'radarData'
    ],
    data () {
      return {}
    },
    mounted: function () {
      const clickHandler = {}
      let radar = new Chart(this.$el, this.radarData, clickHandler)
      console.log(radar)
    },
    watch: {
      radarData: function () {
        const clickHandler = {}
        this.$el.innerHTML = ''
        let radar = new Chart(this.$el, this.radarData, clickHandler)
        console.log(radar)
      }
    }
  }
</script>

<style>
  .scaling-svg-container {
    position: relative;
    height: 0;
    width: 100%;
    padding: 0;
    padding-bottom: 100%;
  }

  .scaling-svg {
    max-height: 80vh;
  }

  .itemLabel, .legendLabel, .areaLabel {
    font-family: 'Oswald', sans-serif;
    opacity: 1;
    transform-origin: top right;
    -moz-transform-origin: 0 0;
  }

  .itemLabel:hover {
    font-weight: bold;
  }

  .itemLabel {
    cursor: pointer;
  }

  .areaFill {
    opacity: 0.5;
  }

  .legendLabel{
    fill: white;
  }

  .legendArcBg {
    fill: #F57C00;
  }

  .areaLabelArc {
    fill: none;
  }
</style>
