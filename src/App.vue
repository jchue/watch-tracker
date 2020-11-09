<template>
  <header>
    <span id="site-title">Watch Tracker</span>

    <Search></Search>
  </header>
  <router-view :key="$route.fullPath"/>
</template>

<script>
import Search from '@/components/Search.vue';

export default {
  components: {
    Search,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#site-title {
  font-size: 14px;
  font-weight: bold;
}

#main-nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
