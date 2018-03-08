<template>
  <div :class="{'card-block': !isMobile(), 'modal-block': isMobile()}" v-if="description">
    <template v-if="isMobile()">
      <h5>{{ locale.skillDescription }}</h5>
    </template>
    <template v-else>
      <h6>{{ locale.skillDescription }}</h6>
    </template>
    <div class="description" v-html="description"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters(['description']),
    },
  };
</script>
