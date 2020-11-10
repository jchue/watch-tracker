<template>
  <div v-bind:class="['indicator', { 'watched': watched }]">
    <span>&check;</span>
  </div>
</template>

<script>
export default {
  name : 'Indicator',
  props: ['watched'],
};
</script>

<style scoped lang="scss">
.indicator {
  color: #fff;
  display: inline-block;
  float: left;
  font-size: 2rem;
  line-height: 1;
  height: 2rem;
  width: 2rem;

  &:not(.watched) {
    background-color: #ddd;
  }

  &.watched {
    background-color: #a9ba7b;
  }
}
</style>
