import Vue from 'vue';
import { initialState } from './state';
import * as types from '../../mutation-types';
import Level from '../../../lib/level';

export default {
  [types.SET_ASCENDANCY](state, ascendancy) {
    state.ascendancy = ascendancy;
  },

  [types.RESET](state) {
    const reset = initialState();
    Object.keys(reset)
      .forEach(key => Vue.set(state, key, reset[key]));
  },

  [types.SET_ACTIVE](state, skillId) {
    state.active = skillId;
  },

  [types.SET_ACTIVE_ALT](state, skillId) {
    state.activeAlt = skillId;
  },

  [types.SET_SKILL_LEVEL](state, { index, level }) {
    Vue.set(state.indexes, index, Level.indexOf(level));
  },

  [types.SET_MODE](state, mode) {
    state.mode = mode;
  },

  [types.SET_GEAR_TECH](state, { skillId, tech }) {
    Vue.set(state.techs, tech, skillId);
  },

  [types.REMOVE_GEAR_TECH](state, tech) {
    Vue.set(state.techs, tech, -1);
  },

  [types.SET_CREST_TECH](state, skillId) {
    state.crestTech = skillId;
  },

  [types.REMOVE_CREST_TECH](state) {
    state.crestTech = -1;
  },

  [types.SET_SKILL_CREST](state, { skillId, index }) {
    Vue.set(state.crests, skillId, index);
  },

  [types.REMOVE_SKILL_CREST](state, skillId) {
    Vue.set(state.crests, skillId, -1);
  },

  [types.ACTIVATE_RELATED_SKILL](state, skillId) {
    Vue.set(state.related, skillId, 1);
  },

  [types.DEACTIVATE_RELATED_SKILL](state, skillId) {
    Vue.set(state.related, skillId, 0);
  },
};
