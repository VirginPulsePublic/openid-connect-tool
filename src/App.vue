<template>
  <div class="app v-cloak" id="app">
    <hello></hello>
  </div>
</template>

<script>
import Hello from '@/components/Hello'

export default {
  name: 'app',
  components: {
    'hello': Hello
  }
}
</script>

<style lang="scss">

</style>
