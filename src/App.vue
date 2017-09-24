<template>
  <div class="app v-cloak" id="app">
    <app-settings></app-settings>
    <results-panel></results-panel>
  </div>
</template>

<script>

import AppSettings from '@/components/AppSettings'
import ResultsPanel from '@/components/ResultsPanel'

export default {
  name: 'app',
  components: {
    AppSettings,
    ResultsPanel
  }
}
</script>

<style lang="scss">

</style>
