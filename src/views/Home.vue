<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <p>Start by searching for a show or movie above.</p>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      title: 'Track Your Watch Activity',
    };
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
.home {
  margin-top: 100px;
}
</style>
