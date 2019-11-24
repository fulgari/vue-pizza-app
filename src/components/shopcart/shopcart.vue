<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
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
          <div class="pay" :class="{'enough':totalPrice>=minPrice,'not-enough':totalPrice<minPrice}" @click="pay">{{payText}}</div>
        </div>
      </div>

      <div class="ball-container">
        <!-- <div class="ball" v-for="ball in balls" :key="ball.index" v-show="ball.show" transition="drop"> -->
          <transition name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
            v-for="(ball, index) in balls" :key="index"
            >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
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
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
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
      balls: [ // 显示动画的小球一共有五个帧
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false}
      ],
      droppingBalls: [] // balls for the animation // 保存多个执行动画的ball
    }
  },
  created() {
    this.$root.eventHub.$on('cart.add', this.drop)
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
      if (this.totalCount === 0) { // decrease to zero, no balls
        // eslint-disable-next-line
        this.isShow = false;
        return false
      }
      // 如果是显示的状态
      // about to show the dropping ball
      if (this.isShow) {
        Vue.nextTick(() => {
          if (!this.scroll) { // already have scroll? if not, the create one // 保存，只创建一次
            // eslint-disable-next-line
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else { // not the first time
            this.scroll.refresh() // then refresh the scroll // 刷新一个滚动(如果高度大于容器元素的高度, 形成滚动条)
          }
        })
      }
      return this.isShow
    }
  },
  methods: {
    toggleList () {
      this.isShow = !this.isShow
    },
    /* 'ele' for dropping movement not working
    // * Display a hidden little ball
    drop (startEl) {
      // find the hidden ball
      const ball = this.balls.find(ball => !ball.isShow)
      // display it
      if (ball) {
        ball.isShow = true
        ball.startEl = startEl
        this.droppingBalls.push(ball)
      }
    },
    */
    // * 指定el的起始位置
    beforeDrop (el) {
      console.log('before()', Date.now())
      /* not working
      // find the correspondant ball
      const ball = this.droppingBalls.shift() // remove the first one

      var offsetY = 0
      var offsetX = 0
      // calculate
      const {left, top} = ball.startEl.getBoundingClientRect()
      const elLeft = 32
      const elBottom = 22
      offsetX = left - elLeft
      offsetY = -(window.innerHeight - top - elBottom)

      // 指定transform样式
      el.style.transform = `translate3d(0, ${offsetY}px, 0)`
      el.children[0].style.transform = `translate3d(${offsetX}px, 0, 0)`

      // save 'ball'
      el.ball = ball
      */
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.querySelector('.inner-hook')
          // let inner = el.getElementsByClassName('inner-hook')[0]
          console.log(rect, inner)
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    //  * 指定el结束位置
    dropping (el) {
      // force repaint // 强制重排重绘
      // eslint-disable-next-line
      el.offsetWidth // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      console.log('dropping() ', Date.now())
      // 异步指定
      this.$nextTick(() => {
        // 指定transform样式
        el.style.transform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.querySelector('.inner-hook')
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    //  * 隐藏el
    afterDrop (el) {
      /* not working
      console.log('afterDrop()', Date.now())
      // must delay the refresh state // 必须延迟更新状态
      setTimeout(() => {
        el.ball.isShow = false
      }, 400)
      */
      let ball = this.droppingBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    /**
    * vue.js 小球下落实现
    */
    drop(el) {
      // 触发一次事件就会对所有小球进行遍历
      for (let i = 0, l = this.balls.length; i < l; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el; // 设置小球的el属性为一个dom对象
          this.droppingBalls.push(ball);
          console.log('ball in', ball);
          return;
        }
      }
    },
    pay () {
      if (this.totalPrice >= this.minPrice) {
        alert(`Please pay : ${this.totalPrice + this.deliveryPrice}€`);
      }
    }
  },
  components: {
    cartcontrol
  }
  /*
  transitions: {
    drop: {
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
        // eslint-disable-next-line
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = `translate3d(0,0,0)`;
          el.style.transform = `translate3d(0,0,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(0,0,0)`;
          inner.style.transform = `translate3d(0,0,0)`;
        })
      },
      afterEnter(el) {
        let ball = this.droppingBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
  }
  */
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";
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
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      &.drop-enter, &.drop-enter-active
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50% // round ball
          background rgb(0, 160, 220)
          transition all 0.4s linear // 最后花了三个小时找的bug，竟然是因为忘记在transition的时间后面加上秒（0.4 -> 0.4s）
  .shopcart-list
    position absolute
    left 0
    top 0
    z-index -1
    width 100%
    transform translate3d(0, -100%, 0) // the status of display
    &.fold-enter-active, &.fold-leave-active
      transition all 0.5s
    &.fold-enter, &.fold-leave-active
      transform translate3d(0, 0, 0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      .title
        float left
        font-size 14px
        color rgb(7, 17, 27)
      .empty
        float right
        font-size 12px
        color rgb(0, 160, 220)
    .list-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
.list-mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 40
  backdrop-filter blur(10px)
  opacity 1
  background rgba(7, 17, 27, 0.6)
  &.fade-enter-active, &.fade-leave-active
    transition all 0.5s
  &.fade-enter, &.fade-leave-active
    opacity 0
    background rgba(7, 17, 27, 0)

</style>
