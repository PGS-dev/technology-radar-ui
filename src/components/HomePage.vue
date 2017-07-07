<template>
  <div>
    <h1>{{ msg }}</h1>

    <div class="u-center">
      <router-link to="/11IUPvEX2RJ_ZoNMQeSVo7ghj2-BpeTCUIG3KoMf7Ifc/" tag="md-button">Frontend Radar</router-link>
      <router-link to="/18Wg-5N7qOnEr1sbSx2f_Yh90kTYNAxnpW7ZHE_9orQg/" tag="md-button">.NET Radar</router-link>
    </div>

    <section class="description" v-once>
      <p>
        The radar has four rings, from outer to inner: hold, assess, trial, and adopt.
      </p>
      <h3>
        Hold
      </h3>
      <p>
        The original intent of the hold ring was "hold off for now", to represent technologies that were too new to
        reasonably assess yet. We had in mind technologies that were getting lots of buzz but weren't yet proven. The
        hold ring has evolved into our way of saying "don't start anything new with this technology". There's no harm in
        using it on existing projects, but you should think twice about using this technology for new development. Hold
        is the closest we have to an avoid category, which Rebecca won't let us have. But we've come to see great wisdom
        in that decision: true to the metaphor, your radar should be about things you are looking towards, not
        recriminations about the past.
      </p>

      <h3>
        Assess
      </h3>
      <p>
        The assess ring indicates that a technology is worth exploring with the goal of understanding how it will affect
        you. You should invest some effort (such as development spikes, research projects, attend conference sessions,
        etc.) to see if it will have an impact on your organization. For example, many large companies visibly went
        through this phase when formulating a mobile strategy.
      </p>

      <h3>
        Trial
      </h3>
      <p>
        The trial ring is for technologies you (and/or your peers) have decided are worth pursuing. It is important to
        understand how to build up this capability. Now is the time to pilot a low-risk project to "get dirty" with the
        technology so that you can really understand it. We wanted an objective criteria for ThoughtWorks to move
        something from assess to trial, and we decided the litmus test is serious usage: we must have used this
        technology on project work. We firmly believe that you can't really fully assess technology unless you've used
        it to solve real problems, to help understand both its weaknesses and strengths. Often, the assess phase shows
        benefits but not limitations, whereas solving real problems provides a holistic view. After all, every
        technology is trying to entice you into using it, touting benefits but hiding deficiencies. It's up to you to
        uncover the weaknesses in new technologies.
      </p>

      <h3>
        Adopt
      </h3>
      <p>
        For technologies in the adopt ring, we feel strongly that the industry should be adopting these items. We use
        them where appropriate on our projects; as close to a "no brainer" as possible.
        We were trying to come up with a good criteria for when something should plainly be in adopt, and my colleague
        Mike Mason developed what we call Mason's Razor: for any of the technologies in the adopt ring, I will make fun
        of you at the pub if you aren't using them. A recent addition is Mason's Second Law: suspect anything that you
        want to move directly into adopt -- do you really understand it well enough?
      </p>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'homePage',
    data () {
      return {
        msg: 'Welcome to Technology Radar App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    text-align: center;
  }

  .description {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .u-center {
    text-align: center;
  }
</style>
