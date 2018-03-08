<template>
  <div class="col-md-4">
    <Ascendancies/>

    <div class="card" v-if="skill.spMaxLevel || skill.techs">
      <div class="card-header active">
        {{ locale.techniques }}
      </div>
      <div class="card-block">
        <Techniques/>
      </div>
    </div>

    <Crests/>
  </div>
</template>

<script>
  import Ascendancies from './Ascendancies';
  import Crests from './Crests';
  import Techniques from '../../common/Techniques';

  export default {
    components: {
      Ascendancies,
      Crests,
      Techniques,
    },
  };
</script>

<style>
  .card .active {
    background: #02151D;
    color: #FFF;
    border-color: rgba(0, 0, 0, 0.121569);
  }

  .card {
    border-color: #02151D;
    margin-bottom: 20px;
  }

  .card .list-group-item {
    font-size: 80%;
  }
</style>
