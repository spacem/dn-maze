import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';

Vue.mixin({
  data() {
    return {
      locale: process.env.LOCALE,
      skillBorder: { background: `url('${process.env.ASSETS_URL}/images/uit_gesturebutton.png')` },
    };
  },

  computed: {
    ...mapState([
      'job',
      'jobs',
      'build',
      'title',
    ]),

    ...mapGetters([
      'active',
      'messages',
      'skill',
      'skills',
      'jobName',
      'ascendancies',
    ]),
  },

  methods: {
    ...mapActions([
      'setAscendancy',
      'activateRelated',
      'deactivateRelated',
      'setActive',
    ]),

    skillName(id) {
      const skills = this.job.skills;
      const messages = this.job.messages;
      return messages[skills[id].name];
    },

    isMobile() {
      return this.$route.name.startsWith('mobile');
    },

    toTop() {
      window.scrollTo(0, 0);
    },

    getJobImageStyle(icon) {
      const scale = 55;
      const xPos = (icon % 9) * scale;
      const yPos = Math.floor(icon / 9) * scale;

      return {
        backgroundImage: `url(${process.env.ASSETS_URL}/images/jobicon_main.png)`,
        height: `${scale}px`,
        width: `${scale}px`,
        backgroundPosition: `-${xPos}px -${yPos}px`,
      };
    },

    getSkillIconStyle(skill, level) {
      const icon = Math.floor(skill.icon / 200) + 1;
      const sprite = icon < 10 ? `0${icon}` : icon;
      const row = Math.floor((skill.icon % 200) / 10);
      const col = skill.icon % 10;
      const suffix = level ? '' : '_b';

      return {
        backgroundImage: `url(${process.env.ASSETS_URL}/images/skillicon${sprite}${suffix}.png)`,
        backgroundPosition: `-${col * 50}px -${row * 50}px`,
      };
    },

    jumpToSkill(skill) {
      this.setAscendancy(skill.jobIndex);
      this.activateRelated(skill.id);
    },

    jumpToSkillTop(skill) {
      this.toTop();
      this.jumpToSkill(skill);
    },

    updatePath(newPath) {
      const slug = this.$route.params.slug;
      const prefix = this.isMobile() ? 'mobile' : 'desktop';
      const name = newPath.length ? `${prefix}-build` : prefix;

      // replace URL (do not add to history)
      this.$router.replace({
        name,
        params: {
          slug,
          path: newPath,
        },
      });

      // if new path is empty, just delete the cookie. otherwise, set it.
      if (!newPath) {
        this.$cookies.remove(slug, location.pathname, location.hostname);
      } else {
        this.$cookies.set(slug, newPath, Infinity, location.pathname, location.hostname);
      }
    },

    doCreate() {
      const { slug, path } = this.$route.params;
      let loadedPath;

      // if a path is given, do not save it (could just be for viewing + pls no overwrite)
      // but if a change is made to this build, then there is an intention to save it
      if (path) {
//        this.$cookies.set(slug, path, Infinity, location.pathname, location.hostname);
        loadedPath = path;
      } else if (this.$cookies.isKey(slug)) {
        // if you have saved build, get it + load it up
        loadedPath = this.$cookies.get(slug);

        // this has to be done because path is empty, so update it to what cookie is
        this.updatePath(loadedPath);
      }

      this.$store.dispatch('loadJob', {
        slug,
        path: loadedPath,
      });
    },
  },

  filters: {
    join: (arr, separator) => arr.join(separator),
  },
});
