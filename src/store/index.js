import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import actions from './actions';
import mutations from './mutations';
import jobs from './modules/jobs';
import job from './modules/job';
import build from './modules/build';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    jobs,
    job,
    build,
  },
});
