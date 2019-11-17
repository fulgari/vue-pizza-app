// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
// import VueScroller from 'vue-scroller';
import moment from 'moment';

import './mock/mockServer';
import './common/stylus/fonts.styl';
import 'common/stylus/index.styl';

Vue.use(VueResource);
// Vue.use(VueScroller);

// register an over-all filter
Vue.filter('date-string', function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
