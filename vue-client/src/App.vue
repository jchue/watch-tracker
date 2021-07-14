<template>
  <div id="app">
    <header id="site-header">
      <div class="wrapper">
        <router-link to="/" id="site-title">Watch Tracker</router-link>

        <Search></Search>
      </div>
    </header>
    <main id="site-content">
      <div class="wrapper">
        <transition name="fade" mode="out-in"><router-view :key="$route.fullPath"/></transition>
      </div>
    </main>
  </div>
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
@import-normalize;

body {
  background-color: #f2f2f2;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}

h1 {
  font-size: 3rem;
  line-height: 1;
  margin: 0 0 2rem 0;
}

h2 {
  font-size: 2rem;
  margin: 0 0 2rem 0;
}

h3 {
  font-size: 1.5rem;
  margin: 0 0 2rem 0;
}

h4 {
  margin: 0 0 2rem 0;
}

p {
  line-height: 1.7;
  margin: 0 0 2rem 0;
}

li {
  line-height: 1.7;
}

#site-header {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
  padding: 10px 20px;
}

#site-title {
  color: #333;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 40px;
  text-decoration: none;
}

#site-content {
  padding-top: 40px;
}

.wrapper {
  margin: auto;
  max-width: 960px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
