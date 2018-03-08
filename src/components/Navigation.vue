<template>
  <nav :class="{ mobile: isMobile() }">
    <div class="d-flex justify-content-between container">
      <ol class="breadcrumb nav-tree">
        <template v-if="title === 'MAZE'">
          <li class="breadcrumb-item">MAZE</li>
        </template>
        <template v-else>
          <li class="breadcrumb-item">
            <router-link :to="isMobile() ? '/m' : '/'">MAZE</router-link>
          </li>
          <li class="breadcrumb-item">{{ title }}</li>
        </template>
      </ol>

      <ol class="breadcrumb info">
        <li class="breadcrumb-item">v{{ buildVersion }}</li>
        <li class="breadcrumb-item">Lv. {{ levelCap }}</li>
      </ol>
    </div>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        levelCap: process.env.LEVEL_CAP,
        buildVersion: process.env.BUILD_VERSION,
      };
    },
  };
</script>

<style>
  nav {
    background: #02151D;
    color: #FFF;
    margin-bottom: 1rem;
  }

  .breadcrumb {
    background: transparent;
    margin-bottom: 0;
  }

  .breadcrumb .active {
    color: #FFF;
  }

  .breadcrumb {
    background: transparent;
    margin-bottom: 0;
  }

  .breadcrumb a, .breadcrumb a:link, .breadcrumb a:visited {
    color: #17bce7;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    color: #18ceff;
    text-decoration: none;
  }

  nav.mobile {
    font-size: 80%;
  }
</style>
