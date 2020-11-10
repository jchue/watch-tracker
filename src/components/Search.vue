<template>
  <form class="search">
    <input type="text" v-model="query" v-on:keyup="search">
    <ul class="results" v-if="query">
      <li><span class="type">TV Shows</span>
        <ul>
          <li v-for="result in results.shows" v-bind:key="result.id"><router-link v-bind:to="'/shows/' + result.id">{{ result.name }}</router-link></li>
        </ul>
      </li>
      <li><span class="type">Movies</span>
        <ul>
          <li v-for="result in results.movies" v-bind:key="result.id"><router-link v-bind:to="'/movies/' + result.id">{{ result.title }}</router-link></li>
        </ul>
      </li>
      <li><span class="type">People</span>
        <ul>
          <li v-for="result in results.people" v-bind:key="result.id"><router-link v-bind:to="'/people/' + result.id">{{ result.name }}</router-link></li>
        </ul>
      </li>
    </ul>
  </form>
</template>

<script>
import axios from 'axios';

const apiKey = process.env.VUE_APP_API_KEY;

export default {
  name: 'Search',
  data() {
    return {
      query  : '',
      results: {},
    };
  },
  methods: {
    search() {
      this.results = {
        movies: [],
        people: [],
        shows : [],
      };

      if (this.query) {
        const config = {
          params: {
            api_key: apiKey,
            query  : this.query,
          },
        };

        axios
          .get('https://api.themoviedb.org/3/search/multi', config)
          .then((response) => {
            response.data.results.forEach((result) => {
              if (result.media_type === 'tv') {
                this.results.shows.push(result);
              } else if (result.media_type === 'movie') {
                this.results.movies.push(result);
              } else if (result.media_type === 'person') {
                this.results.people.push(result);
              }
            });
          });
      } else {
        this.results = [];
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search {
  display: inline-block;
  position: relative;
}

.results {
  background-color: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  display: none;
  min-width: 250px;
  padding: 10px 0;
  position: absolute;
  top: 30px;

  li {
    list-style-type: none;
    margin: 0;
  }

  ul {
    padding: 0;
  }

  li li a {
    color: #333;
    display: block;
    padding: 5px 40px;
    text-decoration: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
}

.search input:focus + .results,
.results:active {
  display: block;
}

.type {
  display: block;
  font-weight: bold;
  padding: 5px 20px;
}

input {
  background-color: rgba(0, 0, 0, 0.07);
  border: 3px solid rgba(0, 0, 0, 0);
  border-radius: 4px;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  margin: 0 10px;
  outline: none;
  padding: 8px 10px;
  transition: border 0.1s;

  &:focus {
    border: 3px solid rgba(0, 0, 0, 0.08);
  }
}
</style>
