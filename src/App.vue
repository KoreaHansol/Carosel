<template>
  <div id="app">
    <Carousel
    :list="list"
    :fillAuto="true"
    :displayCount="5"
    :moveCounter="3"
    />
  </div>
</template>

<script>
import Carousel from './components/carousel.vue'
export default {
  name: 'App',
  components: {
    Carousel
  },
  data() {
    return {
      list: [
        { value: '1' },
        { value: '2' },
        { value: '3' },
        { value: '4' },
        { value: '5' },
        { value: '6' },
        { value: '7' },
        { value: '8' },
        { value: '9' },
        { value: '10' },
        { value: '11' },
        { value: '12' },
        { value: '13' },
      ],
    }
  }
}
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
}
</style>
