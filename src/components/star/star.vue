<template>
  <div class="star" :class="`star-${size}`">
    <span class="star-item" :class="c" v-for="c in starClass" :key="c"></span>
  </div>
</template>

<script>
/**
 * top score: 5
 * min score: >=0.5
 */
const CLASS_ON = 'on';
const CLASS_HALF = 'half';
const CLASS_OFF = 'off';

export default {
  props: {
    score: Number,
    size: Number
  },
  computed: {
    starClass () {
      const scs = [];
      // add CLASS_ON to scs
      var score = this.score;
      var scoreInteger = Math.floor(score);
      for (let i = 0; i < scoreInteger; i++) {
        scs.push(CLASS_ON);
      }
      // add CLASS_HALF to scs
      if (score - scoreInteger >= 0.5) {
        scs.push(CLASS_HALF);
      }
      // add CLASS_OFF to scs
      while (scs.length < 5) {
        scs.push(CLASS_OFF);
      }
      return scs;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl";
  .star-24
    .star-item
      display inline-block
      width 10px
      height 10px
      background-repeat no-repeat
      background-size 10px 10px
      margin-right 3px
      &:last-child
        margin-right 0
    .on
      bg-star(star24_on)
    .half
      bg-star(star24_half)
    .off
      bg-star(star24_off)
  .star-36
    .star-item
      display inline-block
      width 15px
      height 15px
      background-repeat no-repeat
      background-size 15px 15px
      margin-right 4px
      &:last-child
        margin-right 0
    .on
      bg-star(star36_on)
    .half
      bg-star(star36_half)
    .off
      bg-star(star36_off)
  .star-48
    .star-item
      display inline-block
      width 20px
      height 20px
      background-repeat no-repeat
      background-size 20px 20px
      margin-right 5px
      &:last-child
        margin-right 0
    .on
      bg-star(star48_on)
    .half
      bg-star(star48_half)
    .off
      bg-star(star48_off)
</style>
