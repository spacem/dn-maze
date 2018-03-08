<template>
  <div class="text-center">
    <router-link :to="to" @click.native="toTop">
      <div class="mx-auto" :style="jobImageStyle">
        <i class="fa fa-plus ascended" v-if="awakened"/>
      </div>
      <div class="jobTitle" v-if="name">
        {{ name }}
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    props: ['name', 'icon', 'to', 'awakened'],
    computed: {
      jobImageStyle() {
        return this.getJobImageStyle(this.icon);
      },
    },
  };
</script>

<style>
  .jobTitle {
    margin-bottom: 5px;
    height: 50px;
    color: #373a3c;
    line-height: 1.25;
  }

  .jobCell a {
    text-decoration: none;
  }

  .ascended {
    float: right;
    color: #942408;
  }
</style>
