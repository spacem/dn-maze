import Vue from 'vue';
import VueCookies from 'vue-cookies';

// inject vue-router
import router from './router';

// inject vuex store
import store from './store';

// inject global mixin
import './mixins/index';

// inject cookies
Vue.use(VueCookies);

// start Vue with store + router
const app = new Vue({
  store,
  router,
});

app.$mount('#app');
