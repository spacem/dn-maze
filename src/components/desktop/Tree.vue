<template>
  <div class="col-12 col-md-4 unselectable">
    <table class="tree mx-auto" :style="build.ascendancy < 3 && treeStyle" id="tree">
      <tr v-for="(_, row) in 6">
        <td v-for="(_, col) in 4">
          <Skill :id="skillId(build.ascendancy, row, col)"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import Skill from './Skill';

  export default {
    computed: {
      treeStyle() {
        const slug = this.job.ascendancies[this.build.ascendancy].slug;
        return {
          background: `url(${process.env.ASSETS_URL}/images/${slug}.png)`,
        };
      },
    },
    methods: {
      skillId(ascendancy, row, col) {
        return this.job.tree[ascendancy][(row * 4) + col];
      },
    },
    components: {
      Skill,
    },
  };
</script>

<style>
  .tree {
    background-repeat: no-repeat !important;
    background-position: -4px 4px !important;
    background-size: 323px 563px !important;
  }

  #tree {
    background-color: #fff !important;
  }
</style>
