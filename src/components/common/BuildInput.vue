<template>
  <div class="row build-input">
    <div :class="cols[0]">
      <div class="input-group">
        <input :title="locale.buildUrl" type="text" class="form-control" :value="buildUrl"
               id="build-url"/>
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="button" @click="selectUrl">
            <i class="fa fa-files-o"/>
          </button>
        </span>
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="button" @click="$store.dispatch('reset')"
                  :title="locale.reset">
            <i class="fa fa-refresh"/>
          </button>
        </span>
        <span class="input-group-btn" v-if="!isMobile()">
          <button class="btn btn-secondary" type="button" :title="locale.downloadImage"
                  @click="download">
            <i class="fa fa-download"/>
          </button>
        </span>
      </div>
    </div>
    <Alert :class="cols[1]"/>
    <!--<Help/>-->
  </div>
</template>

<script>
  import Alert from './Alert';
  import { BUILD_CHARS } from '../../consts';
  import Level from '../../lib/level';

  export default {
    props: ['cols'],
    data() {
      let location = window.location.href;
      location = location.substring(0, location.indexOf('#'));

      return {
        location,
      };
    },

    watch: {
      path(newPath) {
        this.updatePath(newPath);
      },
    },

    computed: {
      path() {
        const skills = this.skills;
        const build = this.build;
        const indexes = build.indexes;
        const tree = this.$store.getters.tree;
        const techs = build.techs;
        const crestTech = build.crestTech;
        const crests = build.crests;
        const len = tree.length * 24;
        const cmap = BUILD_CHARS;
        const extras = [];

        let path = '';
        let trim = 0;
        let ascendancy = -1;

        for (let i = 0, slot = 0; i < len; i += 1, slot = i % 24) {
          if (slot === 0) {
            ascendancy += 1;
          }

          const skill = skills[tree[ascendancy][slot]];

          if (skill) {
            const level = Level.valueOf(indexes, skill);
            const id = skill.id;
            if (level) {
              if (skill.levelReq[0] === 1) {
                if (level === 1) {
                  path += cmap[0];
                } else {
                  path += cmap[level - 1];
                  trim = i + 1;
                }
              } else {
                path += cmap[level];
                trim = i + 1;
              }
            } else {
              path += cmap[0];
            }

            const extra = [skill.index];
            const tech = techs.indexOf(id);

            if (tech !== -1) {
              switch (tech) {
                case 0:
                  extra.push('w');
                  break;
                case 1:
                  extra.push('n');
                  break;
                case 2:
                  extra.push('e');
                  break;
                case 3:
                default:
                  extra.push('r');
                  break;
              }
            }

            if (crestTech === id) {
              extra.push('c');
            }

            if (crests[id] === 0) {
              extra.push('h');
            } else if (crests[id] === 1) {
              extra.push('H');
            }

            if (extra.length > 1) {
              extras.push(extra.join(''));
            }
          } else {
            path += cmap[0];
          }
        }

        path = path.substring(0, trim);

        if (extras.length) {
          path += `.${extras.join('.')}`;
        }

        if (path) {
          path += '.';
        }

        return path;
      },

      buildUrl() {
        const path = this.path;
        const slug = this.$route.params.slug;
        const prefix = this.isMobile() ? '/m' : '';

        if (path.length) {
          return `${this.location}#${prefix}/${slug}/${this.path}`;
        }

        return `${this.location}#${prefix}/${slug}`;
      },
    },

    methods: {
      selectUrl() {
        document.getElementById('build-url').select();
      },

      download() {
        const ascendancy = this.build.ascendancy;
        const ascendancies = this.ascendancies;
        const slug = ascendancy === 3 ? `${ascendancies[2].slug}-awakened` : ascendancies[ascendancy].slug;

        html2canvas(document.getElementById('ascendancies'), {
          onrendered(canvas1) {
            html2canvas(document.getElementById('tree'), {
              onrendered(canvas2) {
                const ctx1 = canvas1.getContext('2d');
                const ctx2 = canvas2.getContext('2d');

                ctx2.fillStyle = '#fff';

                const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
                const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

                const canvas = document.createElement('canvas');
                canvas.width = canvas1.width + canvas2.width + 20;
                canvas.height = canvas2.height;

                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas2.height);

                ctx.putImageData(data1, 0, 0);
                ctx.putImageData(data2, canvas1.width + 20, 0);

                const a = document.createElement('a');
                a.href = canvas.toDataURL('image/png');
                a.download = `${slug}.png`; // name of file
                a.style.display = 'none';
                a.click();
              },
            });
          },
        });
      },
    },

    components: {
      Alert,
    },
  };
</script>

<style>
  .build-input {
    margin-bottom: 1rem;
  }
</style>
