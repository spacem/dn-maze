<template>
  <div class="home-app container" :class="{ loading: !jobs.loaded }">
    <template v-if="jobs.loaded">
      <template v-if="!isMobile()">
        <div class="row" v-for="partitions in jobPartitions">
          <div class="col-md-3 col-12 col-sm-6 jobsCol" v-for="group in partitions">
            <div class="row" v-for="row in group">
              <div class="col-6" v-for="job in row">
                <Job :name="job.name" :icon="job.icon" :to="'/' + job.slug"
                     :awakened="job.awakened"/>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row jobsRow mobile" v-for="group in jobs.list">
          <div class="col-sm-2 col-2" v-for="job in group">
            <Job :icon="job.icon" :to="'/m/' + job.slug" :awakened="job.awakened"/>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
  import Job from './common/Job';

  export default {
    created() {
      this.$store.dispatch('loadJobs');
    },

    computed: {
      jobPartitions() {
        const list = this.jobs.list;
        const rows = [];
        const groupings = 4;
        const cols = 2;
        const colsList = [];

        list.forEach((group, index) => {
          colsList[index] = [];
          for (let i = 0; i < group.length; i += cols) {
            colsList[index].push(group.slice(i, i + cols));
          }
        });

        for (let i = 0; i < colsList.length; i += groupings) {
          rows.push(colsList.slice(i, i + groupings));
        }

        return rows;
      },
    },

    components: {
      Job,
    },
  };
</script>

<style>
  .jobsCol {
    margin-top: .5rem;
    margin-bottom: 1rem;
  }

  .loading {
    background: url(../../static/loading.gif) no-repeat center;
    height: 300px;
  }
</style>
