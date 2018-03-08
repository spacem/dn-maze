import { mapGetters, mapActions } from 'vuex';
import parameterize from '../lib/parameterize';

export default {
  computed: {
    ...mapGetters([
      'crests',
      'crest',
      'crestCount',
    ]),
  },

  methods: {
    ...mapActions([
      'setSkillCrest',
      'removeSkillCrest',
    ]),

    setCrest(index) {
      if (index === -1) {
        this.removeSkillCrest(this.active);
      } else {
        this.setSkillCrest({ skillId: this.active, index });
      }
    },

    crestDescription(index) {
      const messages = this.messages;
      const crests = this.crests;
      const crest = crests[this.active][index];

      return parameterize(messages[crest.description], crest.params, messages);
    },

    isCrested(crestIndex) {
      const crests = this.build.crests;
      const active = this.active;

      if (arguments.length) {
        return crests[active] === crestIndex;
      }

      return crests[active] === 0 || crests[active] > 0;
    },
  },
};
