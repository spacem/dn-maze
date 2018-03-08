<template>
  <Modal :header="name" :toggle="toggle" :display="display">
    <div class="modal-block">
      <div class="mx-auto text-center">
        <div class="btn-group mobile mode">
          <button type="button" class="btn btn-primary" :class="{active: !build.mode}"
                  @click="setMode(0)">PvE</button>
          <button type="button" class="btn btn-primary" :class="{active: build.mode}"
                  @click="setMode(1)">PvP</button>
        </div>
      </div>

      <h5>Level</h5>

      <div class="form-group">
        <select class="form-control" v-model="levelSelected">
          <option v-for="lvl in levels" :disabled="lvl < 0" :value="Math.abs(lvl)">
            {{ locale.lv }} {{ Math.abs(lvl) }}{{ techCount? ' +' + techCount : null}}
          </option>
        </select>
      </div>
    </div>

    <div class="modal-block" v-if="crests[active]">
      <h5>{{ locale.skillCrest }}</h5>
      <template
        v-if="crestCount === 7 && (build.crests[active] !== 0 && build.crests[active] !== 1)">
        <div>{{ locale.maxedOutCrests }}</div>
      </template>
      <template v-else>
        <div class="form-group">
          <select class="form-control" v-model="crestSelected">
            <option value="-1">{{ locale.none }}</option>
            <option v-for="(crest, crestIndex) in crests[active]" :value="crestIndex"
                    v-html="crestDescription(crestIndex)"/>
          </select>
        </div>
      </template>
    </div>

    <div class="modal-block" v-if="skill.spMaxLevel || skill.techs">
      <h5>{{ locale.techniques }}</h5>
      <Techniques/>
    </div>

    <InformationMeta/>

    <InformationLevelUp :toggle="toggle"/>

    <InformationDescription/>

    <InformationNext/>
  </Modal>
</template>

<script>
  import Modal from '../Modal';
  import Techniques from '../common/Techniques';
  import InformationMeta from '../common/InformationMeta';
  import InformationLevelUp from '../common/InformationLevelUp';
  import InformationDescription from '../common/InformationDescription';
  import InformationNext from '../common/InformationNext';
  import Level from '../../lib/level';
  import informationMixin from '../../mixins/information';
  import crestsMixin from '../../mixins/crests';

  export default {
    mixins: [informationMixin, crestsMixin],

    props: ['toggle', 'display'],

    data() {
      return {
        levelSelected: -1,
        crestSelected: -1,
      };
    },

    beforeMount() {
      this.levelSelected = this.level;
      this.crestSelected = this.crest;
    },

    watch: {
      levelSelected(newVal) {
        if (newVal !== this.level) {
          this.setLevel({
            skillId: this.skill.id,
            level: newVal,
          });
        }
      },

      crestSelected(newVal) {
        if (newVal !== this.crest) {
          this.crestSelected = newVal;
          this.setCrest(newVal);
        }
      },

      level(newVal) {
        this.levelSelected = newVal;
      },

      crest(newVal) {
        this.crestSelected = newVal;
      },
    },

    computed: {
      levels() {
        const { skill, level, spTotals, spTotal, job, meta } = this;
        const jobSpTotal = spTotals[skill.job];
        const ascendancyMaxSp = job.ascendancies[skill.job].sp;
        const maxSp = job.sp;
        const levels = [];

        if (skill.levelReq[0] !== 1) {
          levels.push(0);
        }

        const nowSp = !level ? 0 : skill.spTotal[Level.indexOf(level)];
        let multi = 1;

        for (let i = 1; i <= meta.maxLevel; i += 1) {
          if (i > level && multi > 0) {
            const index = Level.indexOf(i);
            const nextSp = skill.spTotal[index];
            const diff = nextSp - nowSp;
            if (jobSpTotal + diff > ascendancyMaxSp
              || spTotal + diff > maxSp
              || skill.levelReq[index] > process.env.LEVEL_CAP) {
              multi = -1;
            }
          }

          levels.push(i * multi);
        }

        return levels;
      },
    },

    components: {
      Modal,
      Techniques,
      InformationMeta,
      InformationLevelUp,
      InformationDescription,
      InformationNext,
    },
  };
</script>

<style>
  .modal-block:not(:last-child) {
    padding-bottom: 1rem;
  }

  .modal-block .form-group {
    margin-bottom: .5rem;
  }

  .mode {
    margin-bottom: .5rem;
    font-size: 120%;
  }

  .mobile.mode {
    font-size: 125%;
  }

  .mobile.mode button {
    padding-left: 2rem;
    padding-right: 2rem;
  }
</style>
