<template>
  <div :class="{ loading: !job.loaded }">
    <template v-if="job.loaded">
      <BuildInput :cols="['col-md-11 col-10', 'col-md-1 col-2']"/>

      <div class="row">
        <LeftSidebar/>

        <Tree/>

        <RightSidebar/>
      </div>
    </template>
  </div>
</template>

<script>
  import LeftSidebar from './sidebar/LeftSidebar';
  import Tree from './Tree';
  import RightSidebar from './sidebar/RightSidebar';
  import BuildInput from '../common/BuildInput';

  export default {
    created() {
      this.doCreate();
    },

    components: {
      BuildInput,
      LeftSidebar,
      Tree,
      RightSidebar,
    },
  };
</script>

<style>
  .fa, .unselectable {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                     supported by Chrome and Opera */
  }

  .card .list-group .list-group-item:first-child {
    border-top: 0;
  }

  .fa {
    line-height: 1.5;
  }
</style>
