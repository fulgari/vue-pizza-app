<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview-wrapper">
        <div class="overview-top">
          <h1 class="title">{{seller.name}}</h1>
          <div class="count-wrapper">
            <star :score="seller.score" :size="36"></star>
            <span class="ratingCount">({{seller.ratingCount}})</span>
            <span class="sellCount">{{seller.sellCount}} Sold monthly</span>
          </div>
          <div class="heart-wrapper" @click="setHeart">
            <span class="heart">
              <i class="icon-favorite" :class="{active: isHeart}"></i>
            </span>
            <span class="text">{{isHeart?'Liked':'Like'}}</span>
          </div>
        </div>
        <div class="overview-down">
          <div class="info-wrapper">
            <!-- title得用h2标签才能有title在上text在下的排列方式，否则会连在一行 -->
            <h2 class="title">Min. Chg.</h2>
            <span class="text">
              <span class="num">{{seller.minPrice}}</span>
              €
            </span>
          </div>
          <div class="info-wrapper">
            <h2 class="title">Delivery Fee</h2>
            <span class="text">
              <span class="num">{{seller.deliveryPrice}}</span>
              €
            </span>
          </div>
          <div class="info-wrapper">
            <h2 class="title">Avg. Delivery</h2>
            <span class="text">
              <span class="num">{{seller.deliveryTime}}</span>
              min{{seller.deliveryTime>1?'s':''}}
            </span>
          </div>
        </div>
      </div>

      <split></split>

      <div class="bulletin">
        <h1 class="title">Announcement</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <div class="supports" v-if="seller.supports">
          <div class="support-item border-1px" v-for="support in seller.supports" :key="support.index">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </div>
        </div>
      </div>

      <split></split>

      <div class="info">
        <h1 class="title border-1px">Seller Info</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos" :key="info">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from '../star/star.vue'
import split from '../split/split.vue'
import Vue from 'vue'

export default {
  props: {
    seller: Object
  },
  data () {
    return {
      isHeart: false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    Vue.nextTick(() => {
      this._initScroll()
    })
  },
  updated () { // 在当前路由刷新 seller变化了
    console.log('update()')
  },
  methods: {
    setHeart ($event) {
      if (!$event._constructed) {
        return
      }
      this.isHeart = !this.isHeart
    },
    _initScroll () {
      this.sellerScroll = new BScroll(this.$refs.seller, {
        click: true
      })
    }
  },
  components: {
    star,
    split
  }
};
</script>

<style lang="stylus">
@import "../../common/stylus/mixins.styl"
.seller
  position absolute
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .overview-wrapper
    padding 18px 0
    margin 0 18px
    .overview-top
      flex 1
      padding-bottom 18px
      border-bottom 1px solid rgba(7, 17 ,27, 0.1)
      .title
        display inline-block
        top 0
        left 0
        font-size 14px
        line-height 14px
        margin-bottom 8px
        color rgb(7, 17, 27)
      .count-wrapper
        bottom 0
        left 0
        .star
          display inline-block
          vertical-align top
        .ratingCount
          font-size 10px
          line-height 18px
          color rgb(77, 85, 93)
          padding 0 12px 0 8px
        .sellCount
          font-size 10px
          line-height 18px
          color rgb(77, 85, 93)
      .heart-wrapper
        position absolute
        top 18px
        right 11px
        width 50px
        text-align center
        .heart
          .icon-favorite
            display block
            margin-bottom 4px
            line-height 24px
            font-size 24px
            color rgb(147, 153, 159)
            &.active
              color rgb(240, 20, 20)
        .text
          display inline-block
          vertical-align top
          font-size 10px
          line-height 10px
          color rgb(77, 85, 93)
    .overview-down
      display flex
      padding-top 18px
      .info-wrapper
        flex 1
        text-align center
        border-right 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border none
        .title
          font-size 10px
          line-height 10px
          margin-bottom 6px
          color rgb(147, 153, 159)
        .text
          font-size 10px
          line-height 24px
          color rgb(7, 17, 27)
          .num
            font-size 24px
  .bulletin
    padding 18px 18px 0 18px
    .title
      margin-bottom 8px
      line-height 14px
      color rgb(7, 17, 27)
      font-size 14px
    .content-wrapper
      padding 0 12px 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .content
        line-height 24px
        font-size 12px
        color rgb(240, 20, 20)
    .supports
      .support-item
        padding 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size 0
        &:last-child
          border-none()
      .icon
        display inline-block
        width 16px
        height 16px
        vertical-align top
        margin-right 6px
        background-size 16px 16px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_4')
        &.discount
          bg-image('discount_4')
        &.guarantee
          bg-image('guarantee_4')
        &.invoice
          bg-image('invoice_4')
        &.special
          bg-image('special_4')
      .text
        line-height 16px
        font-size 12px
        color rgb(7, 17, 27)
  .info
    padding 18px 18px 0 18px
    color rgb(7, 17, 27)
    .title
      padding-bottom 12px
      line-height 14px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 14px
    .info-item
      padding 16px 12px
      line-height 16px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 12px
      &:last-child
        border-none()
</style>
