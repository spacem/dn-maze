import * as types from './mutation-types';

export default {
  [types.SET_TITLE](state, title) {
    state.title = title;
  },
};
