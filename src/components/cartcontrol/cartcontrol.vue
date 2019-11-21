<template>
  <div class="cartcontrol">
    <transition name="move">
     <div class="cart-decrease icon-remove_circle_outline" v-show="food.count" @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <!-- .stop阻止单击事件继续传播 -->
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>

</template>

<script>
import Vue from 'vue'
export default{
  props: {
    food: Object,
    updateFoodCount: Function
  },
  methods: {
    addCart (event) {
      console.log(event.target)
      // 避免PC发生两次点击事件
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 0) // 用set添加属性，能够检测到，如直接 = 0 则不能被Vue监测
      }
      this.food.count++
      this.$root.eventHub.$emit('cart.add', event.target)
    },
    decreaseCart () {
      if (!event._constructed || !this.food.count) {
        return
      }
      this.food.count--;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
      &.move-enter-active, &.move-leave-active
        transition all .4s linear
      &.move-enter, &.move-leave-active
        opacity 0
        transform translate3d(24px, 0, 0) rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align-last center
      font-size 10px
      color rgb(147, 153, 159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
</style>
