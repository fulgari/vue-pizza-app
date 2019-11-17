import Vue from 'vue';
import Router from 'vue-router';
// import header from 'components/header/header';
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';

// 如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能
Vue.use(Router);

// Router is used for mapping
export default new Router({
  routes: [
    {
      path: '/',
      // name: 'header',
      redirect: 'goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    }
  ]
});
