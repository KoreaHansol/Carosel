<template>
  <div id="app">
    <Carousel
    class="carosel"
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
        { value: '한식' },
        { value: '양식' },
        { value: '한식3' },
        { value: '한식4' },
        { value: '한식5' },
        { value: '한식6' },
        { value: '한식7' },
        { value: '한식8' },
        { value: '한식9' },
        { value: '한식10' },
        { value: '한식11' },
        { value: '한식12' },
        { value: '한식13' },
      ],
    }
  }
}
</script>

<style>
#app {
  display: flex;
  border: 1px solid black;
  width: 100%;
  height: 200px;
}
.carosel {
  height: 50px;
}
</style>
