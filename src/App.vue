<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">

      <div class="tab-item">
        <router-link to="/goods">Goods</router-link>
      </div>

      <div class="tab-item">
        <router-link to="/ratings">Ratings</router-link>
      </div>

      <div class="tab-item">
        <router-link to="/seller">Seller</router-link>
      </div>

    </div>

    <keep-alive>
      <!-- seller从goods中传到App出来，再放在router-view中，使得其他的vue都能够接受到这个数据 -->
      <router-view :seller="seller"></router-view>
    </keep-alive>

  </div>

</template>

<script>
import header from './components/header/header.vue';
import axios from 'axios';

const ERR_OK = 0;

export default{
  data() {
    return {
      seller: {}
    };
  },
  created() {
    // Using 'vue-resource' to send 'ajax' request with the 'express' interface
    /*
    this.$http.get('/api/seller').then((response) => {
      const result = response.body;
      console.log(result);
      if (result.code === ERR_OK) {
        this.seller = response.data;
        console.log('vue-resource', this.seller);
      }
    });
    */

    // Using 'axios' to send 'ajax' request with the 'mockjs' interface
    setTimeout(() => {
      axios.get('/api/seller')
        .then(response => {
          const result = response.data;
          if (result.code === ERR_OK) {
            this.seller = result.data;
            this.seller.score = 3.6;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  // special grammar '@import', which can import other stylus file in this code
  @import "./common/stylus/mixins.styl"
  .tab
    height 40px
    line-height 40px
    display: flex
    //border-bottom 1px solid rgba(7,17,27,0.1)
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      font-size 14px
      color rgb(77,85,93)
      text-align center
      .router-link-active
        color rgb(240, 20, 20)
      & > a
        display block
        font-size 14px
        color rgb(77, 85, 93)
</style>
