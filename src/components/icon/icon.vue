<!-- Not done yet -->
<template>
 
</template>

<script>
export default{
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";
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
</style>