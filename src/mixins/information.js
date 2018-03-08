import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'level',
      'name',
      'meta',
      'techCount',
      'spTotal',
      'spTotals',
    ]),
  },

  methods: {
    ...mapActions(['setMode', 'setLevel']),
  },
};
