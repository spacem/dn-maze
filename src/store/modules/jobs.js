import Vue from 'vue';
import * as types from '../mutation-types';

function initialState() {
  return {
    list: [],
    loaded: false,
  };
}

const state = initialState();

const actions = {
  resetJobs({ commit }) {
    commit(types.RESET_JOBS);
  },
};

const mutations = {
  [types.RESET_JOBS](state) {
    const reset = initialState();
    Object.keys(reset)
      .forEach(key => Vue.set(state, key, reset[key]));
  },

  [types.INIT_JOBS](state, { data }) {
    state.list = data;

    state.loaded = true;
  },
};

export default {
  state,
  actions,
  mutations,
};
