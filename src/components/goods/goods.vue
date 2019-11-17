<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(item, index) in goods" :key="index"
          :class="{current: index===currentIndex}" @click="clickMenuItem(index, $event)">
          <span class="text border-1px">
            <span v-if="item.type>=0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- push-list-hook用于标记当前小标题和菜单栏对应的index -->
        <li class="food-list food-list-hook" v-for="item in goods" :key="item.name">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.name" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">Sold: {{food.sellCount}}</span>
                  <span>Rating: {{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">{{food.price}}€</span>
                  <span class="old" v-show="food.oldPrice">{{food.oldPrice}}€</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import axios from 'axios';
import BScroll from 'better-scroll';
import Vue from 'vue';
import shopcart from '../shopcart/shopcart';

const OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      tops: [],
      scrollY: 0
    };
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    axios.get('/api/goods')
      .then(response => {
        const result = response.data;
        if (result.code === OK) {
          this.goods = result.data;
          // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
          Vue.nextTick(() => {
            // 初始化滚动条
            this._initScroll()
            // 读取右侧所有分类的top值
            this._initTops()
          })
        }
      });
  },
  methods: {
    _initScroll () {
      // 创建menu列表的scroll对象
      // create the Scroll Object for the menu list
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        // 能够让浏览器派发点击事件（因为vue监听器可能会让一些点击变为default，需要手动去产生这个点击事件），但在PC浏览器中会表现为有两个点击事件
        click: true
      });
      // 创建food列表的scroll对象
      // create the Scroll Object for the foods list
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3, // 探针类型3：返回实时滚动的位置
        click: true
      });
      // 绑定scroll监听、实时获取scrollY
      // binding Scroll Listener
      this.foodsScroll.on('scroll', (pos) => {
        // console.log(pos.y);
        this.scrollY = Math.abs(pos.y);
      });
    },
    _initTops () {
      var tops = this.tops;
      var top = 0;
      tops.push(top);
      var lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      [].slice.call(lis).forEach(li => {
        top += li.clientHeight;
        tops.push(top);
      })
      // console.log(tops); // 所有小标题的位置
    },
    // 点击一次在PC中产生两次点击，解决办法就是连同点击事件$event都一起传到去方法中去
    clickMenuItem (index, event) {
      // 过滤掉原生DOM事件。浏览器原生事件不含有该属性，只有手动用BScroll派发事件的时候，_constructed才会为true。
      if (!event._constructed) { // _constructed是better-scroll库添加的
        return
      }
      console.log(index, event) // 当前点击菜单的index和鼠标点击的事件。
      // 将右铡的列表滚动到对应的位置（第index个food-list-hook处）
      var li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
      this.foodsScroll.scrollToElement(li, 300)
    }
  },
  computed: { // ‘计算’属性
    currentIndex () {
      const {tops, scrollY} = this
      // scrollY大于或等于当前的top, 且小于下一个top
      return tops.findIndex((top, index) => {
        return scrollY >= top && scrollY < tops[index + 1]
      })
    }
  },
  components: {
    shopcart
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";

.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background #ffffff
        font-weight 700
        .text
          border-none()
      .text
        display table-cell
        width 56px
        font-size 12px
        vertical-align middle
        border-1px(rgba(7,17,27,0.1))
        .icon
          display inline-block
          vertical-align top
          margin-right 2px
          width 12px
          height 12px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
        .desc
          line-height 12px
          margin-bottom 8px
        .extra
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color rgb(240,20,20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147,153,159)
</style>
