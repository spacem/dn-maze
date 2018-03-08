<template>
  <div class="card ascendancies" id="ascendancies">
    <ul class="list-group list-group-flush">
      <li class="list-group-item ascendancy"
          :class="{active: build.ascendancy === i}"
          @click="setAscendancy(i)"
          v-for="(ascendancy, i) in job.ascendancies">
        <a href="javascript:;" @click.prevent class="d-flex justify-content-between">
          {{ ascendancy.name }}
          <small>{{ spTotals[i] }}{{ ascendancyTechs[i] ? ' +' + ascendancyTechs[i] : ''}} / {{ ascendancy.sp }}</small>
        </a>
      </li>
      <li class="list-group-item ascendancy"
          :class="{active: build.ascendancy === 3}"
          @click="setAscendancy(3)"
          v-if="awakened">
        <a href="javascript:;" @click.prevent>
          {{ locale.awakened }}
        </a>
      </li>
    </ul>
    <div class="card-footer d-flex text-muted justify-content-between disabled">
      {{ locale.totalSP }}
      <small>{{ spTotal }} / {{ job.sp }}</small>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters([
        'spTotals',
        'spTotal',
        'ascendancyTechs',
        'awakened',
      ]),
    },
    methods: {
      ...mapActions([
        'setAscendancy',
      ]),
    },
  };
</script>

<style>
  .ascendancies .card-footer {
    border-top: 0;
    font-size: 80%;
  }

  .ascendancies .card-footer small {
    float: right;
    font-size: 90%;
  }

  .ascendancies small {
    font-size: 90%;
  }

  .card .ascendancy.active {
    background: #107895;
  }

  .ascendancies li {
    padding: 0;
  }

  .ascendancies a {
    color: inherit;
    width: 100%;
    padding: .75rem 1.25rem;
  }
</style>
