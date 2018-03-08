<template>
  <div class="techniques">
    <div class="row">
      <div class="col-6 unselectable" v-if="skill.techs">
        <ul class="tech list-unstyled">
          <li v-for="tech in skill.techs">
            <a href="javascript:;" class="fa fa-fw"
               :class="{ 'fa-square-o': !isTeched(tech.type), 'fa-check-square': isTeched(tech.type) }"
               @click.prevent="maybeTech(tech.type, false)"
            />
            <a href="javascript:;" class="text-black" @click.prevent="maybeTech(tech.type, false)">
              {{ typeName(tech.type) }}
              <template v-if="tech.type > 1">
                ({{ locale.lv }} {{ tech.level }})
              </template>
            </a>
          </li>
        </ul>
      </div>

      <div class="col-6 unselectable">
        <ul class="tech list-unstyled">
          <li>
            <a href="javascript:;" class="fa fa-fw"
               :class="{ 'fa-square-o': !isTeched(0), 'fa-check-square': isTeched(0) }"
               @click.prevent="maybeTech(0, false)"
            />
            <a href="javascript:;" class="text-black" @click.prevent="maybeTech(0, false)">
              {{ typeName(0) }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="tech-alert alert alert-warning" v-if="warning && warningTech !== 10">
      <strong>{{ typeName(warningTech) }}</strong>
      {{ locale.techUsedBy }}
      <strong>{{ warningSkill }}</strong>.

      {{ locale.techWantToReplace }}?
      <br/>
      <a href="javascript:;" @click.prevent="maybeTech(warningTech, true)">{{ locale.yes }}</a>
      /
      <a href="javascript:;" @click.prevent="clearWarning()">{{ locale.no }}</a>
    </div>

    <div class="tech-alert alert alert-warning" v-if="warning && warningTech === 10">
      <strong>{{ typeName(warningTech) }} 1</strong>
      {{ locale.techUsedBy }}
      <strong>{{ warningSkill[0] }}</strong>.

      {{ locale.techWantToReplace }}?
      <br/>
      <a href="javascript:;" @click.prevent="ringTech(build.techs[3], active)">{{ locale.yes }}</a>
      /
      <a href="javascript:;" @click.prevent="clearWarning()">{{ locale.no }}</a>

      <br />
      <br />

      <strong>{{ typeName(warningTech) }} 2</strong>
      {{ locale.techUsedBy }}
      <strong>{{ warningSkill[1] }}</strong>.

      {{ locale.techWantToReplace }}?
      <br/>
      <a href="javascript:;" @click.prevent="ringTech(build.techs[4], active)">{{ locale.yes }}</a>
      /
      <a href="javascript:;" @click.prevent="clearWarning()">{{ locale.no }}</a>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import techMixin from '../../mixins/techs';

  export default {
    mixins: [techMixin],

    data() {
      return {
        warning: false,
        warningSkill: 'Bash',
        warningTech: -1,
      };
    },

    watch: {
      active() {
        this.clearWarning();
      },
    },

    methods: {
      ...mapActions([
        'toggleGearTech',
        'toggleCrestTech',
      ]),

      isTeched(tech) {
        const techs = this.build.techs;
        const skillId = this.active;

        switch (tech) {
          default:
            throw new Error(`Unknown tech: ${tech}`);
          case 0:
            return this.build.crestTech === skillId;
          case 1:
            return techs[0] === skillId;
          case 8:
            return techs[1] === skillId;
          case 9:
            return techs[2] === skillId;
          case 10:
            return techs[3] === skillId || techs[4] === skillId;

        }
      },

      maybeTech(tech, force) {
        const build = this.build;
        const crestTech = build.crestTech;
        const techs = build.techs;
        const skillId = this.active;

        let techIndex = 0;

        switch (tech) {
          default:
            throw new Error(`Unknown tech: ${tech}`);
          case 0:
            if (crestTech !== -1 && crestTech !== skillId && !force) {
              this.setWarning(crestTech, 0);
              return;
            }

            this.techCrest();
            return;
          case 9:
            techIndex += 1;

          // falls through
          case 8:
            techIndex += 1;

          // falls through
          case 1:
            if (techs[techIndex] !== -1 && techs[techIndex] !== skillId && !force) {
              this.setWarning(techs[techIndex], tech);
              return;
            }

            break;
          case 10:
            // both ring slots taken
            if (techs[3] !== -1 && techs[4] !== -1
              && techs[3] !== skillId && techs[4] !== skillId
              && !force) {
              this.setWarning([techs[3], techs[4]], tech);
              return;
            }

            break;
        }

        this.gearTech(tech, this.active);
      },

      gearTech(tech, skillId) {
        this.toggleGearTech({ skillId, tech });
        this.clearWarning();
      },

      techCrest() {
        this.toggleCrestTech(this.active);
        this.clearWarning();
      },

      ringTech(oldSkillId, newSkillId) {
        this.toggleGearTech({ skillId: oldSkillId, tech: 10 });
        this.toggleGearTech({ skillId: newSkillId, tech: 10 });
        this.clearWarning();
      },

      setWarning(skillId, tech) {
        this.warning = true;
        this.warningTech = tech;

        if (tech === 10) { // rings
          this.warningSkill = [
            this.skillName(skillId[0]),
            this.skillName(skillId[1]),
          ];
        } else {
          this.warningSkill = this.skillName(skillId);
        }
      },

      clearWarning() {
        this.warning = false;
      },
    },
  };

</script>


<style>
  .tech {
    list-style-type: none;
    padding-left: 0;
    margin-left: 3px;
    margin-bottom: 0;
  }

  .fa span {
    font: inherit !important;
  }

  a.fa {
    color: inherit !important;
  }

  .text-black {
    color: #000 !important;
  }

  .tech-alert {
    margin-bottom: 0;
    margin-top: 1rem;
  }

  .tech li + li {
    margin-top: .2rem;
  }
</style>
