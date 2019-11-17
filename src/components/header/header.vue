<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}} minutes to go
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports_count" v-if="seller.supports" @click="showDetail(true)">
        <span class="count">{{seller.supports.length-1}} more </span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail(true)">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper">
          <div class="detail-main">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :score="seller.score" :size=48></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">Promotions</div>
              <div class="line"></div>
            </div>
            <ul class="supports">
              <li class="support" v-for="support in seller.supports" :key=support.type>
                <span class="icon" :class="classMap[support.type]"></span>
                <span class="text">{{support.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">Announcement</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="showDetail(false)">
          <span class="icon-close"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import star from '../star/star.vue';

export default{
  props: ['seller'],
  data() {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail(isShow) {
      this.detailShow = isShow;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  components: {
    star
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";

.header
  position relative
  color white
  background rgba(7,17,27,0.5)
  overflow hidden
  .content-wrapper
    padding 24px 12px 18px 24px
    font-size 0
    .avatar
      vertical-align top
      display inline-block
      width 64px
      height 64px
      img
        width: 100%
    .content
      display inline-block
      margin-left 16px
      padding 2px 0 2px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          vertical-align middle
          width 30px
          height 18px
          bg-image(brand)
          background-size 30px 18px
          background-repeat no-repeat
        .name
          vertical-align middle
          margin-left 6px
          font-size 16px
          line-height 18px
          font-weight 700
      .description
        margin-top 6px
        margin-bottom 10px
        line-height 12px
        font-size 12px
        font-weight 12px
      .support
        display none
        .icon
          display inline-block
          width 12px
          height 12px
          background-size 12px 12px
          background-repeat no-repeat
          vertical-align middle
        .decrease
          bg-image(decrease_1)
        .discount
          bg-image(discount_1)
        .guarantee
          bg-image(guarantee_1)
        .invoice
          bg-image(invoice_1)
        .special
          bg-image(special_1)
        .text
          vertical-align middle
          margin-left 4px
          font-size 10px
          line-height 12px
          font-weight 200
    .supports_count
      background rgba(0,0,0,0.2)
      border-radius 8px
      position absolute
      right 12px
      bottom 38px
      height 24px
      padding 0px 8px
      line-height 24px
      text-align center
      .count
        vertical-align top
        font-size 10px
      .icon-keyboard_arrow_right
        line-height 24px
        margin-left 2px
        font-size 10px
  .bulletin-wrapper
    position relative
    padding 0 12px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    height 28px
    line-height 28px
    background rgba(7,17,27,0.2)
    .bulletin-title
      display inline-block
      width 22px
      height 12px
      background-repeat no-repeat
      background-size 22px 12px
      vertical-align middle
      bg-image(bulletin)
    .bulletin-text
      margin 0 4px
      font-size 10px
      font-weight 200
    .icon-keyboard_arrow_right
      font-size 10px
      position absolute
      top 9px
      right 2px
  .background
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index: -1
    filter blur(7px)
    img
      width 100%
      height 100%
  .detail
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(7,17,27,0.8)
    z-index 100
    overflow auto
    backdrop-filter blur(5px)
    &.fade-enter-active, &.fade-leave-active
      transition: opacity .3s linear
    &.fade-enter, &.fade-leave-to
      opacity: 0
    .detail-wrapper
      min-height 100%
      margin-bottom 32px
      .detail-main
        margin-top 64px
        padding-bottom 64px
        .name
          text-align center
          font-size 16px
          line-height 16px
          font-weight 700
          margin-bottom 32px
        .star-wrapper
          height 24px
          text-align center
        .title
          margin 28px auto 24px auto
          display flex
          width 80%
          .line
            position relative
            top 5px
            flex 1
            height 2px
            border-bottom 1px solid rgba(255,255,255,0.2)
          .text
            font-weight 500
            float left
            margin 0 12px
        .supports
          padding 0 48px
          .support
            margin-bottom 12px
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              background-size 16px 16px
              background-repeat no-repeat
              vertical-align middle
            .decrease
              bg-image(decrease_2)
            .discount
              bg-image(discount_2)
            .guarantee
              bg-image(guarantee_2)
            .invoice
              bg-image(invoice_2)
            .special
              bg-image(special_2)
            .text
              margin-left 6px
              font-size 12px
              font-weight 200
              line-height 12px
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            font-size 12px
            line-height 24px
    .detail-close
      position relative
      text-align center
      font-size 32px
      height 32px
      margin -64px 0 0 auto
      clear both
      color rgba(255,255,255,0.5)
</style>
