<template>
  <div class="modal-block overview" v-if="hasTech || crestCount > 0">
    <template v-if="hasTech">
      <h5>{{ locale.techniques }}</h5>
      <ul class="list-unstyled overview-list">
        <li v-if="build.crestTech !== -1">
          <a href="javascript:;" @click.prevent="jump(skills[build.crestTech])">
            {{ skillName(build.crestTech) }}
          </a> - <strong>{{ typeName(0) }}</strong>
        </li>

        <li v-for="(skillId, techIndex) in build.techs" v-if="skillId !== -1">
          <a href="javascript:;" @click.prevent="jump(skills[skillId])">
            {{ skillName(skillId) }}
          </a> - <strong>{{ indexName(techIndex) }}</strong>
          <template v-if="techIndex">
            ({{ locale.lv }} {{ techLevel(skillId, techIndex) }})
          </template>
        </li>
      </ul>
    </template>

    <template v-if="crestCount > 0">
      <h5>{{ locale.crestsEquipped }}</h5>
      <ul class="list-unstyled overview-list">
        <li v-for="(crestIndex, skillId) in build.crests" v-if="crestIndex !== -1">
          <a href="javascript:;" @click.prevent="jump(skills[skillId])">
            {{ skillName(skillId) }}
          </a> -
          <div class="d-inline" v-html="crestDescription(skillId, crestIndex)"/>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import techMixin from '../../mixins/techs';
  import parameterize from '../../lib/parameterize';

  export default {
    mixins: [techMixin],

    props: ['jump'],

    computed: {
      ...mapGetters([
        'crests',
        'crestCount',
      ]),

      hasTech() {
        const techCount = this.build.techs.filter(t => t !== -1).length;
        const crestAdder = this.build.crestTech === -1 ? 0 : 1;
        return techCount + crestAdder > 0;
      },
    },

    methods: {
      skillName(skillId) {
        return this.messages[this.skills[skillId].name];
      },

      crestDescription(skillId, index) {
        const messages = this.messages;
        const crests = this.crests;

        const crest = crests[skillId][index];
        return parameterize(messages[crest.description], crest.params, messages);
      },
    },
  };
</script>


<style>
  .overview {
    margin-top: -1rem;
  }

  .overview h5 {
    margin-bottom: .25rem;
    margin-top: 1rem;
  }

  .overview-list {
    margin-left: 0;
  }
</style>
