<template>
  <div :class="{'card-block': !isMobile(), 'modal-block': isMobile()}" v-if="nextDescription">
    <template v-if="isMobile()">
      <h5 v-if="level < softMaxLevel">{{ locale.nextLevel }}</h5>
      <h5 v-else>{{ locale.plus1ItemEffect }}</h5>
    </template>
    <template v-else>
      <h6 v-if="level < softMaxLevel">{{ locale.nextLevel }}</h6>
      <h6 v-else>{{ locale.plus1ItemEffect }}</h6>
    </template>
    <div class="next-description" v-html="nextDescription"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import parameterize from '../../lib/parameterize';

  export default {
    computed: {
      ...mapGetters([
        'level',
        'softMaxLevel',
        'skillAlt',
        'techCount',
      ]),

      nextDescription() {
        const skill = this.skillAlt;
        const messages = this.messages;
        const level = this.level;
        const techCount = this.techCount;
        const locale = this.locale;
        const mode = this.build.mode;

        // require actual level show when current level is not 0 and not maxed out.
        if (level > 0 && level < skill.maxLevel) {
          // the next index is the current level (next index) + the # of techs to skill
          const nextIndex = level + techCount; // a bad index is still ok (undefined)

          const descriptionId = skill.description[mode][nextIndex];
          const params = skill.params[mode][nextIndex];
          const nowCd = skill.cd[mode][nextIndex - 1];
          const cd = skill.cd[mode][nextIndex];
          let str = messages[descriptionId];

          // there is a description + next level has a cd diff, so prepend to description.
          if (str && nowCd !== cd) {
            str = `#${locale.cooldown}:#w ${cd} ${locale.seconds}\\n${str}`;
          }

          return parameterize(str, params, messages);
        }

        return null;
      },
    },
  };
</script>
