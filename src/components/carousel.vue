<template>
  <div class="wrapper">
    <div class="default-btn" :class="{ leftButtonActive: leftButtonActive }" @click="moveLeft">
      <div name="leftBtn">left</div>
    </div>
    <div class="slider-wrapper" 
      ref="sliderWrapper" 
      v-on:scroll="onScroll( $event )"
      v-on:touchstart="onTouchStart"
      v-on:touchend="onTouchEnd"
    >
      <div class="slider">
        <slot class="item"
          name="carouselList"
          :list="list" >
          <div class="default-item"
            v-for="( item, idx ) in list" 
            :class="{ selected: ( selecedKey === item.value + idx ) ? true : false }"
            :key="idx"
            @click="onSelectItem( item, idx )" >
            <div class="font-item">{{ item.value }}</div>
          </div>
        </slot>
      </div>
    </div>
    <div class="default-btn" :class="{ rightButtonActive: rightButtonActive }" @click="moveRight">
      <div name="rigntBtn">right</div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
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
    itemPaddingLeft: { 
      type: Number,
      default() {
        return 0
      }
    },
    itemPaddingRight: { 
      type: Number,
      default() {
        return 0
      }
    },
    touchEndEventMode: { // 터치가 끝난후 이벤트
      type: Boolean,
      default() {
        return false
      }
    },
  },
  created() {
    this.initCarousel()
  },
  data() {
    return {
      // dom 요소
      slider: null,
      sliderWrapper: null, // wrapper는 overflow: hidden을 slider에 직접 먹였을때 요소가 짤려서 나오기때문에 만든것
      // size, 위치
      posX: 0,
      childOffsetWidth: 0, // item의 offsetWidth ( margin, padding 포함 )
      itemWidth: 0,
      dragClientX: 0,
      // evnet 제어
      mouseStatus: false,
      selecedKey: null,
      leftButtonActive: false,
      rightButtonActive: true,
      scrollDebounce: null,
      touchEnd: false,

      //option
      touchEndEventTimer: 700
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
            this.slider.childNodes[i].style.paddingLeft = this.itemPaddingLeft + 'px'
            this.slider.childNodes[i].style.paddingRight = this.itemPaddingRight + 'px'
            this.slider.childNodes[i].style.width = ( ( ( this.sliderWrapper.clientWidth ) - ( (this.itemPaddingLeft + this.itemPaddingRight) * this.displayCount ) )  / this.displayCount ) + 'px' // * 나중에 border에 대한 값 구해야할듯 *
          }
        }
        this.childOffsetWidth = ( ( this.sliderWrapper.clientWidth ) / this.displayCount )
      } )
    },
    moveLeft() {
      if( this.posX <= 0 ) { // overflow 방지
        this.leftButtonActive = false
        this.posX = 0
        return
      } else {
        this.leftButtonActive = true
      }
      
      if( Math.abs( this.posX ) < Math.abs( this.childOffsetWidth ) * this.moveCounter ) { // 잔여물
        this.sliderWrapper.scrollLeft = 0
        this.posX = 0
        return
      }
      this.posX = ( this.posX - ( this.childOffsetWidth * this.moveCounter ) ) // 정확하게 재기 위해 소수점 1자리까지 계산 반환값이 문자열이라 * 1
      this.sliderWrapper.scrollLeft = Math.abs( this.posX * 1 )
    },
    moveRight() {
      // 화면에서 보이는 left쪽에 붙어있는 시작거리는 this.posX
      const overflow = this.slider.offsetWidth - this.sliderWrapper.offsetWidth
      if( overflow < Math.abs( this.posX ) ) { // 더 이동하는걸 방지
        this.rightButtonActive = false
        return
      } else {
        this.leftButtonActive = true
      }

      if( this.slider.offsetWidth - ( Math.abs( this.posX ) + this.sliderWrapper.offsetWidth ) < this.moveCounter * this.childOffsetWidth ) {
        const residual = this.slider.offsetWidth + ( this.sliderWrapper.offsetWidth + Math.abs( this.posX ) ) // 잔여물
        this.sliderWrapper.scrollLeft = Math.abs( this.posX - residual )
        return
      }
 
      this.posX = ( this.posX + ( this.childOffsetWidth * this.moveCounter ) )
      this.sliderWrapper.scrollLeft = Math.abs( this.posX )
    },
    onSelectItem( item, idx ) {
      const { value } = item
      this.selecedKey = value + idx

      this.$emit( 'selectedItem', item )
    },
    onScrollEventEndByTime() {
      if( !this.scrollDebounce ) {
        this.scrollDebounce = _.debounce( () => {
          if( !this.touchEnd ) {
        return
      }
            
          const index = Math.ceil( this.sliderWrapper.scrollLeft / this.childOffsetWidth )
          if( this.sliderWrapper.scrollLeft / this.childOffsetWidth < index ) {
            if( this.sliderWrapper.scrollLeft - ( this.childOffsetWidth * ( index- 1 ) ) > this.childOffsetWidth / 2 ) {
              this.sliderWrapper.scrollLeft = this.childOffsetWidth * ( index )
            } else {
              this.sliderWrapper.scrollLeft = this.childOffsetWidth * ( index - 1 )
            }
          }
          
        }, this.touchEndEventTimer )
      }
      return this.scrollDebounce
    },
    //스크롤 처리
    onScroll( event ) {
      this.posX = event.target.scrollLeft
      if( this.posX <= 0 ) { // overflow 방지
        this.leftButtonActive = false
        this.posX = 0
      } else {
        this.leftButtonActive = true
      }

      const overflow = this.slider.offsetWidth - this.sliderWrapper.offsetWidth
      if( overflow <= Math.ceil( this.posX ) ) { // 더 이동하는걸 방지
        this.rightButtonActive = false
      } else {
        this.rightButtonActive = true
      }
      if( this.touchEndEventMode ) {
        this.onScrollEventEndByTime(event)()
      }
    },
    onTouchStart() {
      this.touchEnd = false
    },
    onTouchEnd() {
      this.touchEnd = true
    }
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

        .default-item {
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
    }

    .default-btn {
      display: flex;
      justify-content: center;
      align-items: center;
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