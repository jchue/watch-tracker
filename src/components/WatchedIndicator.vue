<template>
  <div v-bind:class="['indicator', { 'watched': watched }]">
    <span>&check;</span>
  </div>
</template>

<script>
export default {
  name: 'Indicator',
  props: ['watched'],
};
</script>

<style scoped lang="scss">
.indicator {
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  font-size: 1.5rem;
  height: 2rem;
  line-height: 1;
  transition: background 0.1s;
  width: 2rem;

  span {
    display: block;
    line-height: 2rem;
    text-align: center;
  }

  &:not(.watched) {
    background-color: #ddd;

    &:hover {
      background-color: #bbb;
    }
  }

  &.watched {
    background-color: #a9ba7b;

    &:hover {
      background-color:  #8b9963;
    }
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
