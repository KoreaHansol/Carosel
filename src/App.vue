<template>
  <div id="app">
    <Carousel
    class="carosel"
    :list="list"
    :fillAuto="true"
    :displayCount="4"
    :moveCounter="2"
    :itemPaddingLeft="30"
    :itemPaddingRight="30"
    >
    <template slot="leftBtn" class="btn">left</template>
    <template slot-scope="{list}" slot="comp">
      <div
        v-for="( item, idx ) in list"
        class="item"
        :class="{ selected: ( selecedKey === item.value + idx ) ? true : false }"
        :key="item.value + idx"
        @click="onSelectItem( item, idx )"
      ><span class="font-item">{{ item.value }}</span></div>
    </template>
    <template slot="rightBtn" class="btn">right</template>
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
        { value: '한식11' },
        { value: '한식22' },
        { value: '한식33' },
        { value: '한식44' },
        { value: '한식55' },
        { value: '한식66' },
        { value: '한식77' },
        { value: '한식88' },
        { value: '한식19' },
        { value: '한식29' },
        { value: '한식39' },
        { value: '한식49' },
        { value: '한식59' },
        { value: '한식69' },
        { value: '한식79' },
        { value: '한식89' },
       
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

    .btn {
      z-index: 1;
      background: red;
      width: 50px;
      height: 50px;
    }
  }
</style>