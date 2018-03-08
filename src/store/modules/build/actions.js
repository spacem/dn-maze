import * as types from '../../mutation-types';
import Level from '../../../lib/level';
import { BUILD_CHARS } from '../../../consts';

export default {
  initBuild({ rootState, dispatch }, path) {
    const cmap = BUILD_CHARS;
    const params = path.split('.');
    const levelsPath = params.shift().split('');
    const len = levelsPath.length;
    const skills = rootState.job.skills;
    const tree = rootState.job.tree;

    let ascendancy = -1;

    for (let i = 0, slot = 0; i < len; i += 1, slot = i % 24) {
      if (slot === 0) {
        ascendancy += 1;
      }

      const skill = skills[tree[ascendancy][slot]];

      if (skill) {
        let index = cmap.indexOf(levelsPath[i]);

        if (skill.levelReq[0] === 1) {
          index += 1;
        }

        dispatch('setLevel', {
          skillId: skill.id,
          level: index,
        });
      }
    }

    const techs = [
      { letter: 'w', equip: 1 },
      { letter: 'n', equip: 8 },
      { letter: 'e', equip: 9 },
      { letter: 'r', equip: 10 },
    ];

    params.forEach((param) => {
      if (!param.match(/^[0-9]+[a-zA-Z]+$/)) {
        return;
      }

      const index = parseInt(param, 10);
      const asc = Math.floor(index / 24);
      const slot = index % 24;
      const skill = skills[tree[asc][slot]];
      const skillId = skill.id;

      techs.forEach((tech) => {
        if (param.indexOf(tech.letter) !== -1) {
          dispatch('toggleGearTech', { skillId, tech: tech.equip });
        }
      });

      if (param.indexOf('c') !== -1) {
        dispatch('toggleCrestTech', skillId);
      }

      const [h, H] = [param.indexOf('h'), param.indexOf('H')];
      if (h !== -1 || H !== -1) {
        dispatch('setSkillCrest', { skillId, index: h !== -1 ? 0 : 1 });
      }
    });
  },

  reset({ commit }) {
    commit(types.RESET);
  },

  setAscendancy({ commit }, ascendancy) {
    commit(types.SET_ASCENDANCY, ascendancy);
  },

  setActive({ commit, getters, dispatch }, skillId) {
    if (skillId !== getters.active) {
      commit(types.SET_ACTIVE, skillId);
      commit(types.SET_ACTIVE_ALT, -1);
    }

    dispatch('deactivateRelated', skillId);
  },

  setActiveAlt({ commit }, skillId) {
    commit(types.SET_ACTIVE_ALT, skillId);
  },

  setLevel({ commit, state, getters, rootState }, { skillId, level }) {
    const job = rootState.job;
    const skill = job.skills[skillId];
    const ascendancies = job.ascendancies;
    const index = skill.index;
    const currentLevel = Level.valueOf(state.indexes, skill);

    // out of level range or didn't change
    if (level > skill.maxLevel || currentLevel === level) {
      return;
    }

    const spTotals = getters.spTotals;
    const spTotal = getters.spTotal;
    const maxSp = job.sp;
    const jobIndex = skill.job;

    if (currentLevel > level) {
      commit(types.SET_SKILL_LEVEL, { index, level });
    } else {
      const currIndex = Level.indexOf(currentLevel);
      const lastIndex = Level.indexOf(level);

      let currSkillSpTotal = 0;
      let nextIndex = 0;
      let newLevel = currentLevel;

      if (typeof currIndex === 'number') {
        currSkillSpTotal = skill.spTotal[currIndex];
        nextIndex = currIndex + 1;
      }

      for (; nextIndex <= lastIndex; nextIndex += 1, newLevel += 1) {
        const diffSp = skill.spTotal[nextIndex] - currSkillSpTotal;

        if (spTotals[jobIndex] + diffSp > ascendancies[jobIndex].sp
          || spTotal + diffSp > maxSp) {
          break;
        }
      }

      if (newLevel !== currentLevel) {
        commit(types.SET_SKILL_LEVEL, { index, level: newLevel });
      }
    }
  },

  setMode({ commit }, mode) {
    commit(types.SET_MODE, mode);
  },

  toggleGearTech({ commit, state }, { skillId, tech }) {
    const techs = state.techs;
    const index = techs.indexOf(skillId);

    if (index !== -1) {
      commit(types.REMOVE_GEAR_TECH, index);
    }

    switch (tech) {
      default:
        throw Error(`Invalid tech option: ${tech}`);
      case 1:
        if (index !== 0) {
          commit(types.SET_GEAR_TECH, { skillId, tech: 0 });
        }
        break;
      case 8:
        if (index !== 1) {
          commit(types.SET_GEAR_TECH, { skillId, tech: 1 });
        }
        break;
      case 9:
        if (index !== 2) {
          commit(types.SET_GEAR_TECH, { skillId, tech: 2 });
        }
        break;
      case 10:
        if (index === 3) {
          commit(types.SET_GEAR_TECH, { skillId: techs[4], tech: 3 });
          commit(types.SET_GEAR_TECH, { skillId: -1, tech: 4 });
          break;
        } else if (index === 4) {
          break;
        }

        if (techs[3] === -1) {
          commit(types.SET_GEAR_TECH, { skillId, tech: 3 });
        } else if (techs[4] === -1) {
          commit(types.SET_GEAR_TECH, { skillId, tech: 4 });
        } else { // slide it over
          commit(types.SET_GEAR_TECH, { skillId: techs[4], tech: 3 });
          commit(types.SET_GEAR_TECH, { skillId, tech: 4 });
        }
        break;
    }
  },

  toggleCrestTech({ commit, state }, skillId) {
    if (state.crestTech === skillId) {
      commit(types.REMOVE_CREST_TECH);
    } else {
      commit(types.SET_CREST_TECH, skillId);
    }
  },

  setSkillCrest({ commit, getters }, { skillId, index }) {
    if (getters.crestCount < 7) {
      commit(types.SET_SKILL_CREST, { skillId, index });
    }
  },

  removeSkillCrest({ commit }, skillId) {
    commit(types.REMOVE_SKILL_CREST, skillId);
  },

  activateRelated({ commit, state }, skillId) {
    if (!state.related[skillId]) {
      commit(types.ACTIVATE_RELATED_SKILL, skillId);
    }
  },

  deactivateRelated({ commit }, skillId) {
    commit(types.DEACTIVATE_RELATED_SKILL, skillId);
  },
};
