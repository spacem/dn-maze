<template>
  <div :class="col">
    <div class="input-group justify-content-end">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button"
                @click="toggleAlertModal"
                :title="validBuild ? locale.noBuildIssues : locale.buildIssues"
        >
          <i class="fa" :class="statusClass"/>
        </button>
      </span>
    </div>

    <Modal header="Issues" :toggle="toggleAlertModal" :display="alertModal" v-if="validBuild">
      <div class="modal-block">
        {{ locale.noBuildIssues }}.
      </div>

      <Overview :jump="jump"/>
    </Modal>
    <Modal header="Issues" :toggle="toggleAlertModal" :display="alertModal" v-else>
      <div class="modal-block">
        <div v-for="(violation, skillId) in violations">
          <a href="javascript:;" @click="jump(skills[skillId])">{{ skillName(skillId) }}</a>
          <template v-if="violation.type === 'ascendancy'">
            {{ locale.needs }}
            <span class="comma-separated" v-for="d in violation.data">
            {{ ascendancies[d.ascendancy].name }} {{ locale.jobSPReq[0] }} {{ d.sp
            }} {{ locale.jobSPReq[1] }}
          </span>
          </template>
          <template v-else-if="violation.type === 'parent'">
            {{ locale.needs }}
            <span class="comma-separated" v-for="d in violation.data">
            {{ skillName(d.id) }} {{ locale.lv }} {{ d.level }}
          </span>
          </template>
          <template v-else>
            {{ locale.conflictsWith }} {{ skillName(violation.data) }}

          </template>
        </div>
      </div>

      <Overview :jump="jump"/>
    </Modal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Modal from '../Modal';
  import Overview from './Overview';
  import Level from '../../lib/level';

  export default {
    props: ['col'],

    data() {
      return {
        alertModal: false,
      };
    },

    computed: {
      ...mapGetters([
        'tree',
        'spTotals',
      ]),

      violations() {
        const violations = {};
        const indexes = this.build.indexes;
        const tree = this.tree;
        const skills = this.skills;
        const spTotals = this.spTotals;

        const parents = {};
        const conflicts = { group: {}, base: {} };
        const conflictables = ['group', 'base'];
        const ascendancies = {};

        let index = -1;

        for (let i = 0, slot = 0; i < indexes.length; i += 1, slot = i % 24) {
          if (slot === 0) {
            index += 1;
          }

          const skill = skills[tree[index][slot]];

          if (skill) {
            const level = Level.valueOf(indexes, skill);

            if (level) {
              if (skill.parents) {
                parents[skill.id] = [];
                skill.parents
                  .filter(parent => Level.valueOf(indexes, skills[parent.id]) < parent.level)
                  .forEach(parent => parents[skill.id].push({ ...parent }));
              }

              ascendancies[skill.id] = [];
              skill.ascendancies.forEach((sp, ascendancy) => {
                if (spTotals[ascendancy] < sp) {
                  ascendancies[skill.id].push({ ascendancy, sp });
                }
              });

              conflictables.forEach((name) => {
                const value = skill[name];
                if (value) {
                  if (!conflicts[name][value]) {
                    conflicts[name][value] = [skill.id];
                  } else {
                    conflicts[name][value].push(skill.id);
                  }
                }
              });
            }
          }
        }

        if (conflicts.group[1]) { // there exists ult
          if (conflicts.group[1].length === 2) {
            const [ultA, ultB] = conflicts.group[1];
            if (parents[ultA] || parents[ultB]) {
              delete parents[ultA];
              delete parents[ultB];
            }
          }

          delete conflicts.group[1];
        }

        Object.keys(ascendancies)
          .forEach((id) => {
            if (ascendancies[id].length) {
              violations[id] = { type: 'ascendancy', data: ascendancies[id] };
            }
          });

        Object.keys(parents)
          .forEach((id) => {
            if (!violations[id] && parents[id].length) { // do not add more info than needed
              violations[id] = { type: 'parent', data: parents[id] };
            }
          });

        conflictables.forEach((name) => {
          Object.values(conflicts[name])
            .forEach((conflict) => {
              if (conflict.length !== 1) {
                const skillId1 = conflict[0];
                const skillId2 = conflict[1];
                if (skillId1 < skillId2) { // overwrite as this takes priority
                  violations[skillId1] = { type: 'conflict', data: skillId2 };
                  delete violations[skillId2]; // don't duplicate messages
                }
              }
            });
        });

        return violations;
      },

      validBuild() {
        return !Object.keys(this.violations).length;
      },

      statusClass() {
        const valid = this.validBuild;
        return {
          'text-success': valid,
          'fa-check': valid,
          'text-warning': !valid,
          'fa-exclamation-triangle': !valid,
        };
      },
    },

    methods: {
      toggleAlertModal() {
        this.alertModal = !this.alertModal;
      },

      jump(skill) {
        this.toggleAlertModal();
        this.jumpToSkillTop(skill);
      },
    },

    components: {
      Modal,
      Overview,
    },
  };
</script>
