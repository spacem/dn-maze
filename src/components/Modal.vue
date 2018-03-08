<template>
  <transition name="fade" v-if="display" v-on:enter="toggleHideOverflow" v-on:after-leave="toggleHideOverflow">
    <div class="modal" @click.self.once="toggle" :class="{ mobile: isMobile() }">
      <div class="modal-dialog violations">
        <div class="modal-content">
          <div class="modal-header" :class="{mobile: isMobile()}">
            <h4 class="modal-title">{{ header }}</h4>
            <a href="javascript:;" class="fa fa-times" @click.prevent.once="toggle" />
          </div>

          <div class="modal-body">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  const html = document.getElementsByTagName('html')[0];

  export default {
    props: ['header', 'toggle', 'display'],
    methods: {
      toggleHideOverflow() {
        html.classList.toggle('hide-overflow-y');
      },
    },
  };
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }

  .modal {
    background-color: rgba(0, 0, 0, .5);
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .violations {
    position: absolute;
    margin: 30px auto;
    top: 0;
    left: 0;
    right: 0;
    width: 90%;
  }

  .hide-overflow-y {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .modal.mobile {
    font-size: 80%;
  }

  .modal.mobile .fa-times {
    width: 50px;
    text-align: right;
  }

  .mobile.modal-header .fa-times {
    font-size: 200%;
  }
</style>
