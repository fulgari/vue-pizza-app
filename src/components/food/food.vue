<template>
  <transition>

    <div class="food" v-show="isShow" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="show(false)">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>

        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">{{food.sellCount}} pieces sold/month</span>
            <span class="rating">satisfaction {{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">{{food.price}}€</span>
            <span class="old" v-show="food.oldPrice">{{food.oldPrice}}€</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
          </div>
          <div class="buy" v-show="!food.count" @click="updateFoodCount(food, true, $event)">Add to cart</div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll';
import Vue from 'vue';
// import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';

export default {
  props: {
    food: Object,
    updateFoodCount: Function
  },
  data () {
    return {
      isShow: false,
      onlyContent: true
      // selectType: ALL
    };
  },
  created() {
    this.desc = {
      all: 'All',
      positive: 'positive',
      negative: 'negative'
    }
  },
  methods: {
    show (isShow) {
      this.isShow = !this.isShow;
      if (isShow) {
        Vue.nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    }
  },
  computed: { // ‘计算’属性

  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";

.food
  position fixed
  left 0
  top 0
  bottom 48px
  z-index 30
  width 100%
  background #fff
  &.move-enter-active, &.move-leave-active
    transition all .2s linear
  &.move-enter, &.move-leave-active
    opacity 0
    transition translate3d(100%, 0, 0)
  .image-header
    position relative
    width 100%
    height 0
    padding-top 100%
    img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .back
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        display block
        padding 10px
        font-size 20px
        color #b0b0b0
  .content
    position relative
    padding 18px
    .title
      line-height 14px
      margin-bottom 8px
      font-size 14px
      font-weight 700
      color rgb(7, 17, 27)
    .detail
      margin-bottom 18px
      line-height 10px
      height 10px
      font-size 0
      .sell-count, .rating
        font-size 10px
        color rgb(147, 153, 159)
      .sell-count
        margin-right 12px
    .price
      font-weight 700
      line-height 24px
      .now
        margin-right 8px
        font-size 14px
        color rgb(240, 20, 20)
      .old
        text-decoration line-through
        font-size 10px
        color rgb(147, 153, 159)
    .cartcontrol-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10
      height 24px
      line-height 24px
      padding 0 12px
      box-sizing border-box
      border-radius 12px
      font-size 10px
      color #fff
      background rgb(0, 160, 220)
      &.fade-transition
        transition all 0.2s
      &.fade-enter, &.fade-leave
        opacity 0

</style>
