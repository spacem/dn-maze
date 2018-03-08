<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="text-center mobile ascendancy" v-for="(ascendancy, i) in job.ascendancies">
        <div class="mx-auto" @click.prevent="setAscendancy(i)" :style="getJobImageStyle(ascendancy.icon)"/>
        <small>{{ getSpRemaining(i) }}</small>
      </div>
      <div class="mobile ascendancy" v-if="awakened">
        <div class="mx-auto" @click.prevent="setAscendancy(3)"
             :style="getJobImageStyle(job.ascendancies[2].icon)">
          <i class="fa fa-plus ascended" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    computed: {
      ...mapGetters([
        'spTotals',
        'spTotal',
        'awakened',
      ]),

      progressPercent() {
        const spTotal = this.spTotal;
        const maxSp = this.job.sp;

        return (spTotal / maxSp) * 100;
      },
    },

    methods: {
      ...mapActions([
        'setAscendancy',
      ]),

      getSpRemaining(ascendancy) {
        const job = this.job;
        const thisSp = job.ascendancies[ascendancy].sp - this.spTotals[ascendancy];
        return Math.min(thisSp, job.sp - this.spTotal);
      },
    },
  };
</script>

<style>
  .mobile.ascendancy {
    padding: 0 .3rem;
  }
</style>
