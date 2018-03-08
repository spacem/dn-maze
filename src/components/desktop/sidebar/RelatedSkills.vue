<template>
  <div class="card" v-if="relatedSkills">
    <div class="card-header active">
      {{ locale.relatedSkills }}
    </div>
    <div class="card-block">
      <a href="javascript:;" class="skill-icon d-inline-block" v-for="skill in relatedSkills"
         :style="skillImageStyle(skill)"
         @click.prevent="jumpToSkillTop(skill)"
      >
        <div class="skill-border" :style="skillBorder"/>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      relatedSkills() {
        const skill = this.skill;
        const skills = this.skills;
        if (!skill.related) {
          return null;
        }

        return skill.related.map(id => skills[id]);
      },
    },

    methods: {
      skillImageStyle(skill) {
        return this.getSkillIconStyle(skill, 1);
      },
    },
  };
</script>

<style scoped>
  .skill-icon {
    margin-right: .5rem;
  }

  .card-block {
    padding-bottom: .5rem;
    padding-top: .5rem;
  }
</style>
