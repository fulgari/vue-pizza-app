<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight': totalCount>0}">{{totalPrice}}€ </div>
        <div class="desc">Delivery Fee {{deliveryPrice}}€ </div>
      </div>
      <div class="content-right">
        <!-- :class="totalPrice>=minPrice?'enough':'not-enough'" , 换种表达-->
        <div class="pay" :class="{'enough':totalPrice>=minPrice,'not-enough':totalPrice<minPrice}">{{payText}}</div>
      </div>
    </div>

    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">Cart</h1>
          <span class="empty" @click="clearCart">Clear</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in foodList" :key="food.name">
              <span class="name">{{food.name}} * {{food.count}}</span>
              <div class="price"><span>{{food.price}}€ </span></div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
// import Vue from 'vue'
// import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'

export default{
  props: {
    minPrice: Number,
    deliveryPrice: Number,
    updateFoodCount: Function,
    foodList: Array,
    clearCart: Function

  },
  data() {
    return {
      isShow: false,
      balls: [
        {isShow: false},
        {isShow: false},
        {isShow: false},
        {isShow: false},
        {isShow: false}
      ],
      droppingBalls: [] // balls for the animation // 保存多个执行动画的ball
    }
  },
  created() {
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.foodList.forEach((food) => {
        total += food.price * food.count;
      });
      // console.log(total)
      return total;
    },
    totalCount() {
      let count = 0;
      this.foodList.forEach((food) => {
        count += food.count
      });
      // console.log(count)
      return count;
    },
    payText () {
      var minPrice = this.minPrice;
      var totalPrice = this.totalPrice;

      if (totalPrice === 0) {
        return `Min. Chg. ${minPrice}€ `
      } else if (totalPrice < minPrice) {
        return `${minPrice - totalPrice}€ short`
      } else {
        return 'Check out'
      }
    },
    listShow () {
      /*
      if (this.totalCount === 0) { // decrease to zero, no balls
        this.isShow = false;
        return false
      }
      // 如果是显示的状态
      // about to show the dropping ball
      if (this.isShow) {
        Vue.nextTick(() => {
          if (!this.scroll) { // already have scroll? if not, the create one // 保存，只创建一次
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else { // not the first time
            this.scroll.refresh() // then refresh the scroll // 刷新一个滚动(如果高度大于容器元素的高度, 形成滚动条)
          }
        })
      }
      */
      return this.isShow
    }

  },
  components: {
    cartcontrol
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shopcart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  height 48px
  .content
    display flex
    background #141d27
    .content-left
      flex 1
      .logo-wrapper
        display inline-block
        vertical-align top
        position relative
        top -10px
        margin 0 12px
        padding 6px
        width 56px
        height 56px
        box-sizing border-box
        border-radius 50%
        background #141d27
        .logo
          width 100%
          height 100%
          border-radius 50%
          background #2b343c
          text-align center
          &.highlight
            background rgb(0, 160, 220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
            color #80858a
            &.highlight
              color: #fff
        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          line-height 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight 700
          color #ffffff
          background rgb(240, 20, 20)
          box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display inline-block
        vertical-align top
        margin-top 12px
        line-height 24px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255,255,255,0.1)
        font-size 17px
        font-weight 700
        color rgba(255,255,255,0.4)
        &.highlight
          color #ffffff
      .desc
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        color rgba(255,255,255,0.4)
        font-size 10px
    .content-right
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-size 12px
        color rgba(255,255,255,0.4)
        font-weight 700
        background #2b333b
        &.not-enough
          background #2b333b
        &.enough
          background #00b43c
          color #fff
</style>
