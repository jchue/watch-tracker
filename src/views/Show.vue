<template>
  <div class="show">
    <img v-bind:src="posterUrl" class="poster">

    <span class="media-type">TV Show</span>
    <h1>{{ title }}</h1>

    <section class="metadata">
      <section class="genres">
        <strong>Genre(s): </strong>

        <ul>
          <li v-for="genre in genres" v-bind:key="genre.id">{{ genre.name }}</li>
        </ul>
      </section>

      <section class="score">
        <strong>Rating:</strong> {{ score }}/10
      </section>

      <section class="website">
        <a v-bind:href="website">Website</a>
      </section>
    </section>

    <p>{{ overview }}</p>

    <section class="cast">
      <h2>Cast</h2>

      <ul>
        <li v-for="member in cast" v-bind:key="member.id">
          <div class="photo" v-bind:style="'background-image: url(' + member.photo + ');'"></div>
          {{ member.name }}
        </li>
      </ul>
    </section>

    <h2>Seasons</h2>

    <ul>
      <li v-for="season in seasons" v-bind:key="season.id">
        <h3>{{ season.name }}</h3>
        <p>{{ season.overview }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

const apiKey     = process.env.VUE_APP_API_KEY;
const imgBaseUrl = process.env.VUE_APP_IMG_BASE_URL;

export default {
  name: 'Show',
  data() {
    return {
      cast     : [],
      genres   : [],
      id       : this.$route.params.id,
      overview : '',
      posterUrl: '',
      score    : 0,
      seasons  : [],
      title    : '',
      website  : '',
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
        this.genres    = response.data.genres;
        this.title     = response.data.name;
        this.overview  = response.data.overview;
        this.score     = response.data.vote_average;
        this.seasons   = response.data.seasons;
        this.posterUrl = `${imgBaseUrl}w300${response.data.poster_path}`;
        this.website   = response.data.homepage;
      });

    axios
      .get(`https://api.themoviedb.org/3/tv/${this.id}/credits`, config)
      .then((response) => {
        this.cast      = response.data.cast;

        this.cast.forEach((member) => {
          axios
            .get(`https://api.themoviedb.org/3/person/${member.id}`, config)
            .then((response2) => {
              if (response2.data.profile_path) {
                member.photo = `${imgBaseUrl}w45${response2.data.profile_path}`;
              }
            });
        });
      });
  },
};
</script>

<style scoped lang="scss">
.media-type {
  background-color: #bf9445;
  color: #fff;
  display: inline-block;
  font-size: 0.75rem;
  line-height: 1;
  margin: 0 0 1rem 0;
  padding: 5px 7px;
  text-transform: uppercase;
}

.poster {
  background-color: #fff;
  float: right;
  margin: 0 0 10px 20px;
  padding: 10px;
}

.metadata {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
}

.genres {
  ul {
    display: inline;
    list-style-type: none;
    padding: 0;

    li {
      display: inline;

      &:not(:last-child)::after {
        content: ', ';
      }
    }
  }
}

.cast {
  ul {
    list-style-type: none;
    padding: 0;

    li {
      background-color: #fff;
      border-radius: 35px;
      box-sizing: border-box;
      color: #666;
      display: inline-block;
      font-size: 0.875rem;
      height: 66px;
      margin: 5px;
      padding: 8px 20px 8px 8px;

      .photo {
        background-color: #ccc;
        background-size: cover;
        background-position: center;
        border-radius: 25px;
        display: inline-block;
        height: 50px;
        margin-right: 10px;
        width: 50px;
        vertical-align: middle;
      }
    }
  }
}
</style>
