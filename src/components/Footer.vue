<template>
  <footer class="footer">
    <hr/>

    <div class="d-flex justify-content-between">
      <ul class="list-unstyled">
        <li v-for="region in regions" v-if="region.region === curr">{{ region.name }}</li>

        <li v-for="region in regions" v-if="region.region !== curr">
          <a :href="getUrl(region.url)">{{ region.name }}</a>
        </li>
      </ul>

      <ul class="list-unstyled text-right">
        <li><a href="javascript:;" @click.prevent="toggleHelpModal">{{ locale.help }}</a></li>
        <li>
          <router-link :to="invertedRoute" @click.native="toTop">
            <template v-if="isMobile()">{{ locale.desktop }}</template>
            <template v-else>{{ locale.mobile }}</template>
          </router-link>
        </li>
      </ul>
    </div>

    <Modal header="Controls" :toggle="toggleHelpModal" :display="helpModal">
      <p><kbd>click</kbd> a skill icon to increase its level by 1.<br/>
        <kbd><kbd>ctrl</kbd> + <kbd>click</kbd></kbd> a skill icon to cap it out. Alias: <kbd><kbd>shift</kbd>
          + <kbd>click</kbd></kbd>
      </p>

      <p><kbd>leftclick</kbd> a skill icon to decrease its level by 1.<br/>
        <kbd><kbd>ctrl</kbd> + <kbd>leftclick</kbd></kbd> a skill icon set it to its lowest level.
        Alias: <kbd><kbd>shift</kbd>
          + <kbd>leftclick</kbd></kbd></p>

      <p>
        <small>note: the alias controls may not work for all browsers</small>
      </p>

      <p>
        <small>note 2: need a real translator for other regions</small>
      </p>
    </Modal>
  </footer>
</template>

<script>
  import 'whatwg-fetch';
  //  import Axios from 'axios';
  import Modal from './Modal';

  export default {
    created() {
      let url = process.env.REGIONS_URL;
      url = url.replace('http:', window.location.protocol);

      fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.regions = data;
        });
    },

    data() {
      return {
        helpModal: false,
        curr: process.env.REGION,
        regions: [],
      };
    },

    computed: {
      invertedRoute() {
        let path = this.$route.fullPath;

        if (this.isMobile()) {
          path = path.substring(2);
          return path.length ? path : '/';
        }

        return `/m${path}`;
      },
    },

    methods: {
      toggleHelpModal() {
        this.helpModal = !this.helpModal;
      },

      getUrl(url) {
        const retUrl = `${window.location.protocol}//${url}`;

        // S3 site redirects seem to retain the '/#/' stuff.
        if (this.isMobile()) {
          return `${retUrl}/#/m/`;
        }

        return retUrl;
      },
    },

    components: {
      Modal,
    },
  };
</script>

<style>
  hr {
    margin-top: 0;
    margin-bottom: .5rem;
  }

  .list-unstyled {
    margin: 0 .5rem;
  }
</style>
