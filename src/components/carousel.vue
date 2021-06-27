<template>
  <div class="wrapper">
    <div class="button-left" 
      @click="moveLeft" 
    />
    <div class="slider-wrapper" ref="sliderWrapper" v-on:scroll="onScroll( $event )">
      <div class="slider">
        <div class="item" v-for="( item, idx ) in list" 
          :key="item.value + idx"
          @click="onSelectItem( item, idx )"
          :class="{ selected: ( selecedKey === item.value + idx ) ? true : false }"
        >
          <span class="font-item">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <div class="button-right" @click="moveRight"
    />
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    fillAuto: { // 지정하지않으면 기본 item width 값은 100px 입니다
      type: Boolean,
      default() {
        return false
      }
    },
    displayCount: { // fillAuto를 지정하지 않으면 의미가 없습니다
      type: Number,
      default() {
        return 5
      }
    },
    moveCounter: { // 움직일 갯수
      type: Number,
      default() {
        return 5
      }
    },
  },
  created() {
    this.initCarousel()
  },
  data() {
    return {
      posX: 0,
      slider: null,
      sliderWrapper: null, // wrapper는 overflow: hidden을 slider에 직접 먹였을때 요소가 짤려서 나오기때문에 만든것
      childOffsetWidth: 0, // item의 offsetWidth ( margin, padding 포함 )
      itemWidth: 0,
      dragClientX: 0,
      mouseStatus: false,
      selecedKey: null,
      leftButtonActive: false,
      rightButtonActive: true
    }
  },
  computed: {
  },
  methods: {
    initCarousel() {
      this.$nextTick( () => { // UI가 생성되고 나서 init 진행
        this.slider = this.$refs.sliderWrapper.firstChild
        this.sliderWrapper = this.$refs.sliderWrapper
        if( this.fillAuto ) { // sliderWapper크기에 맞추어 item의 크기를 자동으로 맞춰줌
          for( let i = 0; i < this.slider.childNodes.length; i++ ) {
            this.slider.childNodes[i].style.width = ( this.sliderWrapper.clientWidth / this.displayCount ) + 'px' // * 나중에 border에 대한 값 구해야할듯 *
          }
        }
        this.childOffsetWidth = ( this.sliderWrapper.clientWidth / this.displayCount )
      } )
    },
    moveLeft() {
      if( this.posX <= 0 ) { // overflow 방지
        this.leftButtonActive = false
        this.posX = 0
        return
      }
      
      if( Math.abs( this.posX ) < Math.abs( this.childOffsetWidth ) * this.moveCounter ) { // 잔여물
        this.sliderWrapper.scrollLeft = 0
        this.posX = 0
        return
      }
      this.posX = ( this.posX - ( this.childOffsetWidth * this.moveCounter ) ).toFixed(1) * 1 // 정확하게 재기 위해 소수점 1자리까지 계산 반환값이 문자열이라 * 1
      this.sliderWrapper.scrollLeft = Math.abs( this.posX * 1 )
    },
    moveRight() {
      // 화면에서 보이는 left쪽에 붙어있는 시작거리는 this.posX
      const overflow = this.slider.offsetWidth - this.sliderWrapper.offsetWidth
      if( overflow < Math.abs( this.posX ) ) { // 더 이동하는걸 방지
        this.rightButtonActive = false
        return
      }
      if( this.slider.offsetWidth - ( Math.abs( this.posX ) + this.sliderWrapper.offsetWidth ) < this.moveCounter * this.childOffsetWidth ) {
        const residual = this.slider.offsetWidth + ( this.sliderWrapper.offsetWidth + Math.abs( this.posX ) ) // 잔여물
        this.sliderWrapper.scrollLeft = Math.abs( this.posX - residual )
        return
      }
 
      this.posX = ( this.posX + ( this.childOffsetWidth * this.moveCounter ) ).toFixed(1) * 1
      this.sliderWrapper.scrollLeft = Math.abs( this.posX )
    },
    onSelectItem( item, idx ) {
      const { value } = item
      this.selecedKey = value + idx

      this.$emit( 'selectedItem', item )
    },
    //스크롤 처리
    onScroll( event ) {
      this.posX = event.target.scrollLeft
    },
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    display: flex;
    width: 100%;
    .slider-wrapper {
      display: flex;
      flex: 1 1 auto;
      max-width: 100%;
      overflow: auto;
      user-select: none;
      scroll-behavior: smooth;
      .slider {
        display: flex;
        transition: 0.5s;
        flex: 1 0 auto;
        user-select: none;
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
          }
        }
      }
    }
    .button-left {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 50px;
      z-index: 1;
      user-select: none;
    }
    .button-left::before {
        content: '';
        width: 20px; /* 사이즈 */
        height: 20px; /* 사이즈 */
        border-top: 5px solid #f4879a; /* 선 두께 */
        border-right: 5px solid #f4879a; /* 선 두께 */
        transform: rotate(225deg); /* 각도 */
    }
    .button-right {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 50px;
      z-index: 1;
      user-select: none;
    }
    .button-right::before {
      content: '';
      width: 20px; /* 사이즈 */
      height: 20px; /* 사이즈 */
      border-top: 5px solid #f4879a; /* 선 두께 */
      border-right: 5px solid #f4879a; /* 선 두께 */
      transform: rotate(45deg); /* 각도 */
    }

    // 스크롤숨김
    .slider-wrapper {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }
    .slider-wrapper::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
</style>