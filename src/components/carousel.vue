<template>
  <div class="wrapper">
    <div class="button-left" 
      @click="moveLeft" 
    />
    <div class="slider-wrapper" ref="sliderWrapper">
      <div class="slider" 
          @mousedown="mouseDown( $event )"
          @mousemove="mouseMove( $event )"
          @mouseup="mouseUp( $event )"
          @mouseleave="mouseLeave( $event )"
        >
        <div class="item" v-for="( item, idx ) in list" 
          :key="item.value + idx"
          @click="selecedKey=item.value + idx"
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
    fillAuto: {
      type: Boolean,
      default() {
        return false
      }
    },
    displayCount: {
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
      if( this.posX >= 0 ) { // overflow 방지
        this.leftButtonActive = false
        return
      }
      
      if( Math.abs( this.posX ) < Math.abs( this.childOffsetWidth ) * this.moveCounter ) { // 잔여물
        this.slider.style.transform = `translateX(${ this.posX + Math.abs( this.posX ) }px)`
        this.posX = 0
        return
      }

      this.posX = ( this.posX + ( this.childOffsetWidth * this.moveCounter ) ).toFixed(1) * 1 // 정확하게 재기 위해 소수점 1자리까지 계산 반환값이 문자열이라 * 1
      this.slider.style.transform = `translateX(${ this.posX * 1 }px)`

    },
    moveRight() {
      // 화면에서 보이는 left쪽에 붙어있는 시작거리는 this.posX
      const overflow = this.slider.offsetWidth - this.sliderWrapper.offsetWidth
      if( overflow < Math.abs( this.posX ) ) { // 더 이동하는걸 방지
        this.rightButtonActive = false
        return
      }

      if( this.slider.offsetWidth - ( Math.abs( this.posX ) + this.sliderWrapper.offsetWidth ) < this.moveCounter * this.childOffsetWidth ) {
        const residual = this.slider.offsetWidth - ( this.sliderWrapper.offsetWidth + Math.abs( this.posX ) ) // 잔여물
        this.slider.style.transform = `translateX(${ this.posX - residual }px)` // 잔여물 만큼만 이동
        this.posX = this.posX - residual
        return
      }

      this.posX = ( this.posX - ( this.childOffsetWidth * this.moveCounter ) ).toFixed(1) * 1
      this.slider.style.transform = `translateX(${ this.posX }px)`
    },
    // 여기부터 스크롤 안쓰려고 만든건데 touch는 어떻게 할지 생각해야 할듯 ( 마우스만됨 )
    mouseDown( event ) {
      this.mouseStatus = true
      this.dragClientX = event.clientX
    },
    mouseLeave() {
      this.mouseStatus = false
    },
    mouseUp() {
      this.mouseStatus = false
    },
    mouseMove( event ) {
      if( !this.mouseStatus ) {
        return
      }
      let offset = this.dragClientX - event.clientX
      this.dragClientX = event.clientX

      this.posX = ( this.posX - offset ).toFixed(1) * 1
      console.log( this.posX )
      this.slider.style.transform = `translateX(${this.posX}px)`
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
      overflow: hidden;
      user-select: none;

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
  }

</style>
