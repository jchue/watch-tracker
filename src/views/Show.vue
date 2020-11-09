<template>
  <div class="show">
    <h1>{{ title }}</h1>

    <p>{{ overview }}</p>
  </div>
</template>

<script>
import axios from 'axios';

const apiKey = process.env.VUE_APP_API_KEY;

export default {
  name: 'Show',
  data() {
    return {
      id: this.$route.params.id,
      title: '',
      overview: '',
    };
  },
  mounted() {
    const config = {
      params: {
        api_key: apiKey,
      },
    };

    axios
      .get(`https://api.themoviedb.org/3/tv/${this.id}`, config)
      .then((response) => {
        console.log(response.data);
        this.title = response.data.name;
        this.overview = response.data.overview;
      });
  },
};
</script>
