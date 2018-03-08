let typeMap = {};
let indexMap = [];

function initMaps(locale) {
  if (!indexMap.length) {
    typeMap = {
      0: locale[4],
      1: locale[0],
      8: locale[1],
      9: locale[2],
      10: locale[3],
    };

    indexMap = [typeMap[1], typeMap[8], typeMap[9], typeMap[10], typeMap[10]];
  }
}

export default {
  methods: {
    techLevel(skillId, index) {
      initMaps(this.locale.techGear);

      const skills = this.skills;
      const skill = skills[skillId];
      const name = indexMap[index];
      const tech = skill.techs.filter(t => typeMap[t.type] === name)[0];

      return tech.level;
    },

    typeName(type) {
      initMaps(this.locale.techGear);

      return typeMap[type];
    },

    indexName(index) {
      initMaps(this.locale.techGear);

      return indexMap[index];
    },
  },
};
