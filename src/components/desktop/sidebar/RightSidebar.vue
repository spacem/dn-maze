<template>
  <div class="col-md-4">
    <Information/>

    <RelatedSkills/>
  </div>
</template>

<script>
  import Information from './Information';
  import RelatedSkills from './RelatedSkills';

  export default {
    components: {
      Information,
      RelatedSkills,
    },
  };
</script>
