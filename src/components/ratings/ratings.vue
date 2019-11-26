<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">Overall Score</div>
          <div class="rank">Higher than {{seller.rankRate}}% restaurants</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">Service</span>
            <star :score="seller.serviceScore" :size="36"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">Food</span>
            <star :score="seller.foodScore" :size="36"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">Delivery Time</span>
            <span class="delivery">{{seller.deliveryTime}} minutes</span>
          </div>
        </div>
      </div>

      <split></split>

      <ratingselect :desc="desc" :only-content="onlyContent" :ratings="ratings"
                    :select-type="selectType"
                    @setSelectType="setSelectType"
                    @switchOnlyContent="switchOnlyContent"
      ></ratingselect>

      <split></split>

      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-for="rating in filterRatings" :key="rating.index">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :score="rating.score" :size="24"></star>
                <span class="delivery" v-show="rating.deliveryTime">delivery: {{rating.deliveryTime}} minutes</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="rating.rateType === 0 ? 'icon-thumb_up' : 'icon-thumb_down'"></span>
                <span class="item" v-for="item in rating.recommend" :key="item.index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | date-string}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import axios from 'axios';
import star from '../star/star';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';
import Vue from 'vue';
export default {
  props: {
    seller: Object
  },
  data () {
    return {
      ratings: [],
      onlyContent: false,
      selectType: 2
    }
  },
  created () {
    this.desc = {
      all: 'All',
      positive: 'Positive',
      negative: 'Negative'
    }
    // 因为不可能从goods中获取到ratings的mock数据，所以只能再重复一次axios获取ratings数据的过程（和goods中获取数据类似）
    axios.get('/api/ratings')
      .then(response => {
        const result = response.data
        if (result.code === 0) {
          this.ratings = result.data

          Vue.nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
      })
  },
  methods: {
    setSelectType (selectType) {
      this.selectType = selectType

      this.$nextTick(() => {
        // 刷新列表的Scroll对象
        this.scroll.refresh()
      })
    },
    switchOnlyContent () {
      this.onlyContent = !this.onlyContent

      this.$nextTick(() => {
        // 刷新列表的Scroll对象
        this.scroll.refresh()
      })
    }
  },
  computed: {
    filterRatings () {
      if (!this.ratings) {
        return
      }
      const {selectType, onlyContent} = this

      // selectType: 0, 1, 2
      // onlyContent: true, false
      return this.ratings.filter(rating => {
        if (selectType === 2) {
          // 如果onlyContent为false, 直接返回true, 否则还要看text有没有值
          // 即如果没有勾上“只显示有内容”直接返回true，能够输出该rating，否则再判断是否含有文字内容
          return !onlyContent || !!rating.text
        } else {
          // 既要比较type, 还要比较content
          return selectType === rating.rateType && (!onlyContent || !!rating.text)
        }
      })
    }
  },
  components: {
    star,
    split,
    ratingselect
  }
};
</script>

<style lang="stylus">
@import "../../common/stylus/index.styl";
.ratings
  position absolute
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 9px 0
    .overview-left
      flex 0 0 137px
      padding 6px 0
      width 137px
      border-right 1px solid rgba(7, 17, 27, 0.1)
      text-align center
      .score
        line-height 28px
        font-size 24px
        color rgb(255, 153,0)
        margin-bottom 6px
      .title
        font-size 12px
        line-height 12px
        color rgb(7, 17, 27)
        margin-bottom 8px
      .rank
        line-height 10px
        font-size 10px
        color rgb(147, 153, 159)
    .overview-right
      flex 1
      padding 6px 0 6px 24px
      .score-wrapper
        margin-bottom 8px
        font-size 0
        .title
          display inline-block
          line-height 18px
          vertical-align top
          font-size 12px
          color rgb(7, 17, 27)
        .star
          display inline-block
          margin 0 12px
          vertical-align top
        .score
          display inline-block
          line-height 18px
          vertical-align top
          font-size 12px
          color rgb(255, 153, 0)
      .delivery-wrapper
        font-size 0
        .title
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)
        .delivery
          margin-left 12px
          font-size 12px
          color rgb(147, 153, 159)
  .rating-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        flex 0 0 28px
        width 28px
        margin-right 12px
        img
          border-radius 50%
      .content
        position relative
        flex 1
        .name
          margin-bottom 4px
          line-height 12px
          font-size 10px
          color rgb(7, 17, 27)
        .star-wrapper
          margin-bottom 6px
          font-size 0
          .star
            display inline-block
            margin-right 6px
            vertical-align top
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
        .text
          margin-bottom 8px
          line-height 18px
          color rgb(7, 17, 27)
          font-size 12px
        .recommend
          line-height 16px
          font-size 0
          .icom-thumb_up, icon-thumb_down, .item
            display inline-block
            margin 0 8px 4px 0
            font-size 9px
          .icon-thumb_up
            color rgb(0, 160, 220)
          .icon-thumb_down
            color rgb(147, 153, 159)
          .item
            padding 0 6px
            border 1px solid rgba(7, 17, 27, 0.1)
            border-radius 1px
            color rgb(147, 153, 159)
            background #fff
        .time
          position absolute
          top 0
          right 0
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)

</style>
