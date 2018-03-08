<template>
  <div class="card information">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item text-center">
          <a class="nav-link" @click="setMode(0)" :class="{active: !build.mode}"
             href="javascript:;">PvE</a>
        </li>
        <li class="nav-item text-center">
          <a class="nav-link" @click="setMode(1)" :class="{active: build.mode}" href="javascript:;">PvP</a>
        </li>
      </ul>
    </div>

    <InformationMeta />

    <InformationLevelUp />

    <InformationDescription />

    <InformationNext />
  </div>
</template>

<script>
  import InformationMeta from '../../common/InformationMeta';
  import InformationLevelUp from '../../common/InformationLevelUp';
  import InformationDescription from '../../common/InformationDescription';
  import InformationNext from '../../common/InformationNext';
  import informationMixin from '../../../mixins/information';

  export default {
    mixins: [informationMixin],

    components: {
      InformationMeta,
      InformationLevelUp,
      InformationDescription,
      InformationNext,
    },
  };
</script>

<style>
  .card .card-block + .card-block {
    padding-top: 0;
  }

  .information .card-header {
    background: #02151D;
    color: #fff;
  }

  .information .nav-link {
    color: #FFF;
  }

  .information .nav-item {
    width: 50%;
  }

  .information .nav-item a {
    border: 0;
  }

  .card-block {
    font-size: 80%;
  }

  span.o {
    color: #bf8100;
  }

  span.y {
    color: #888800;
  }

  span.p {
    color: #8a8166;
  }

  span.r {
    color: #a82121;
  }

  span.s {
    color: #699fb3;
  }

  span.v {
    color: #904f90;
  }

  .comma-separated + .comma-separated:before {
    content: ", ";
  }

  .red {
    color: #8b0000;
  }
</style>
