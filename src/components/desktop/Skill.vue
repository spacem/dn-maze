<template>
  <div class="skill d-flex flex-column" v-if="id">
    <a href="javascript:;" class="skill-icon" :style="skillImageStyle"
       @click.prevent
       @mouseover="setActive(id)"
       @mousedown.stop.prevent="changeLevelEvent"
       @contextmenu.stop.prevent>
      <div class="skill-border"
           :style="skillBorder"
           :class="{ grayscale: !level, crested, blink: relatedRecently }"/>
    </a>
    <small class="skill-level text-center"
           :class="{ green: techCount === 1, blue: techCount === 2 }"
    >{{ displayLevel }}/{{ softMaxLevel }}
    </small>
  </div>
  <div class="skill" v-else/>
</template>

<script>
  import Level from '../../lib/level';
  import skillMixin from '../../mixins/skill';

  export default {
    mixins: [skillMixin],

    methods: {
      setActiveLevel(level) {
        if (this.skill.levelReq[Level.indexOf(level)] > process.env.LEVEL_CAP) {
          return;
        }

        this.setLevel({
          skillId: this.id,
          level,
        });

        this.setActive(this.id);
      },

      changeLevelEvent(e) {
        const max = e.shiftKey || e.ctrlKey;

        if (!e.button) { // left click
          this.nextLevel(max);
        } else if (e.button === 2) { // right click
          this.previousLevel(max);
        }
      },

      nextLevel(max) {
        if (max && this.level < this.softMaxLevel) {
          this.setActiveLevel(this.softMaxLevel);
        } else {
          this.setActiveLevel(this.level < this.softMaxLevel ?
            this.level + 1 : this.level);
        }
      },

      previousLevel(max) {
        if (max) {
          this.setActiveLevel(-1);
        } else {
          this.setActiveLevel(this.level - 1);
        }
      },
    },
  };
</script>

<style>
  .skill {
    height: 65px;
    width: 50px;
    margin: 8px 10px 12px 10px;
  }

  .skill-icon, .skill-border {
    height: 50px;
    width: 50px;
  }

  .skill-level {
    line-height: 1.5;
    background: #fff;
  }

  .grayscale {
    background-position-y: -52px !important;
  }

  .skill-border.crested {
    background-position-y: 52px !important;

  }

  .skill-level.green {
    color: #4ea722;
  }

  .skill-level.blue {
    color: #3195bd;
  }

  .blink {
    animation: blink-animation .5s steps(2, start) infinite;
    -webkit-animation: blink-animation .5s steps(2, start) infinite;
  }

  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }

  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
</style>
