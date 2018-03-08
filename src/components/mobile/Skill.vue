<template>
  <div class="skill d-flex flex-column" v-if="id" @click="iconClick">
    <div class="skill-icon" :style="skillImageStyle">
      <div class="skill-border" :style="skillBorder" :class="{ grayscale: !level, crested, blink: relatedRecently }"/>
    </div>
    <small class="skill-level text-center"
           :class="{ green: techCount === 1, blue: techCount === 2 }"
    >{{ displayLevel }}/{{ softMaxLevel }}
    </small>
  </div>
  <div class="skill empty" v-else/>
</template>

<script>
  import skillMixin from '../../mixins/skill';

  export default {
    mixins: [skillMixin],

    props: ['id', 'toggle'],

    methods: {
      iconClick() {
        if (this.relatedRecently && this.level) {
          this.deactivateRelated(this.id);
        } else {
          this.setActive(this.id);
          this.toggle();
        }
      },
    },
  };
</script>
