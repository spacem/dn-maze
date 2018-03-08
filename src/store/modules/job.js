import Vue from 'vue';
import * as types from '../mutation-types';

function initialState() {
  return {
    ascendancies: [],
    tree: [],
    messages: {},
    crests: {},
    skills: {},
    weapons: {},
    sp: 0,
    loaded: false,
  };
}

const state = {
  ...initialState(),
  desired: null,
};

const getters = {
  jobName(state) {
    return state.ascendancies.length ? state.ascendancies[2].name : '';
  },

  ascendancies: state => state.ascendancies,
  tree: state => state.tree,
  messages: state => state.messages,
  crests: state => state.crests,
  skills: state => state.skills,
  weaponMap: state => state.weapons,
  awakened: state => state.tree.length > 3,
};

const actions = {
  resetJob({ commit }) {
    commit(types.RESET_JOB);
  },

  setDesired({ commit }, slug) {
    commit(types.SET_DESIRED_JOB, slug);
  },

  initJob({ state, commit, dispatch }, { data, path }) {
    if (data.ascendancies[2].slug !== state.desired) {
      return; // user is navigating around too fast
    }

    commit(types.INIT_JOB, data);

    dispatch('setTitle', data.ascendancies[2].name);

    if (path) {
      dispatch('initBuild', path);
    }
  },
};

const mutations = {
  [types.RESET_JOB](state) {
    const reset = initialState();
    Object.keys(reset)
      .forEach(key => Vue.set(state, key, reset[key]));
  },

  [types.SET_DESIRED_JOB](state, slug) {
    state.desired = slug;
  },

  [types.INIT_JOB](state, data) {
    Object.keys(data)
      .forEach(key => Vue.set(state, key, data[key]));

    state.loaded = true;
  },
};

export default {
  state,
  actions,
  getters,
  mutations,
};
