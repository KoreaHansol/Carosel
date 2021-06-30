<template>
  <div id="app">
    <Carousel
    class="carosel"
    :list="list"
    :fillAuto="true"
    :displayCount="5"
    :moveCounter="1"
    >
    <template slot-scope="{list}" slot="comp">
      <div
        v-for="( item, idx ) in list"
        class="item"
        :class="{ selected: ( selecedKey === item.value + idx ) ? true : false }"
        :key="item.value + idx"
        @click="onSelectItem( item, idx )"
      ><span class="font-item">{{ item.value }}</span></div>
    </template>
    </Carousel>
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
        { value: '한식1' },
        { value: '한식2' },
        { value: '한식3' },
        { value: '한식4' },
        { value: '한식5' },
        { value: '한식6' },
        { value: '한식7' },
        { value: '한식8' },
       
      ],
      selecedKey: null,
    }
  },
  methods: {
    onSelectItem( item, idx ) {
      const { value } = item
      this.selecedKey = value + idx
      console.log( this.selecedKey )
    },
  }
}
</script>

<style scoped lang="scss">
  #app {
  display: flex;
  border: 1px solid black;
  width: 100%;
  height: 200px;
  .item {
    display: flex;
    width: 100px;
    justify-content: center;
    align-items: center;
    user-select: none;

    &.selected {
      border-bottom: 12px solid #f4879a;
    }

    .font-item {
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      color: #000000;
      overflow:hidden; 
      text-overflow:ellipsis; 
      white-space:nowrap;
    }
  }
  }
  .carosel {
    height: 50px;
  }
</style>