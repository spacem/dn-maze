<template>
  <div :class="{'card-block': !isMobile(), 'modal-block': isMobile()}" v-if="showLevelUpReq">
    <template v-if="isMobile()">
      <h5>{{ locale.levelUp }}</h5>
    </template>
    <template v-else>
      <h6>{{ locale.levelUp }}</h6>
    </template>

    <div v-if="next.levelReq">
      {{ locale.charLevel }} {{ next.levelReq }}
    </div>

    <div class="red" v-if="next.parents" v-for="parent in next.parents">
      <a href="javascript:;" @click="jumpToSkill(job.skills[parent.id]); toggle && toggle()">
        {{ skillName(parent.id) }}
      </a>
      {{ locale.lv }} {{ parent.level }}
    </div>

    <div class="red" v-if="ascendancyReqs.length">
        <span v-for="req in ascendancyReqs">
          {{ job.ascendancies[req.ascendancy].name }} {{ locale.jobSPReq[0] }} {{ req.sp }} {{ locale.jobSPReq[1] }}
        </span>
    </div>

    <div :class="{ red: lackSp }" v-if="next.spCost">
      SP {{ next.spCost }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    props: ['toggle'],

    computed: {
      ...mapGetters([
        'spTotals',
        'spTotal',
        'next',
        'level',
        'techCount',
      ]),

      lackSp() {
        const { spTotal, spTotals, skill, next, job } = this;
        const spCost = next.spCost;

        return spTotal + spCost > job.sp
          || spTotals[skill.job] + spCost > job.ascendancies[skill.job].sp;
      },

      ascendancyReqs() {
        const spTotals = this.spTotals;
        const skill = this.skill;
        const reqs = [];

        // ensure sp totals required by this skill is fulfilled
        skill.ascendancies.forEach((sp, ascendancy) => {
          if (spTotals[ascendancy] < sp) {
            reqs.push({ ascendancy, sp });
          }
        });

        return reqs;
      },

      showLevelUpReq() {
        const { next, ascendancyReqs, skill, level, techCount } = this;
        const parents = next.parents ? next.parents.length : 0;

        // as long as skill isn't fully maxed / has parents/ascendency reqs,
        // show this component
        if (level + techCount < skill.maxLevel) {
          return next.levelReq || parents || ascendancyReqs.length || next.spCost;
        }

        return parents || ascendancyReqs.length;
      },
    },
  };
</script>
