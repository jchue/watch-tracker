<template>
  <div class="show">
    <img v-bind:src="posterUrl" class="poster">

    <!--
      Header
    -->
    <span class="media-type">TV Show</span>
    <h1>{{ title }}</h1>

    <!--
      Metadata
    -->
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

    <!--
      Details
    -->
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

    <!--
      Season list
    -->
    <section class="seasons">
      <h2>Seasons</h2>

      <ul>
        <li v-for="season in seasons" v-bind:key="season.id">
          <h3 v-on:click="toggleSeason(season.season_number)" class="season-name">{{ season.name }}</h3>

          <!-- Hidden until clicked -->
          <section v-bind:class="['season-details', { 'visible': season.visible }]">
            <p v-if="season.overview">{{ season.overview }}</p>

            <!--
              Episode list
            -->
            <h4>Episodes</h4>

            <table class="episodes">
              <thead>
                <tr>
                  <th class="watched-indicator">Viewed</th>
                  <th class="episode-number">#</th>
                  <th class="title">Title</th>
                  <th class="air-date">Air Date</th>
                  <th class="hidden"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="episode in season.episodes" v-bind:key="episode.id">
                  <td class="watched-indicator">
                    <indicator v-bind:watched="episode.watched" v-on:click="toggleWatchedStatus(episode)"></indicator>
                  </td>
                  <td class="episode-number" v-on:click="showEpisodeDetails(episode)">
                    {{ episode.episode_number }}
                  </td>
                  <td class="title" v-on:click="showEpisodeDetails(episode)">
                    {{ episode.name }}
                  </td>
                  <td class="air-date" v-on:click="showEpisodeDetails(episode)">
                    {{ episode.air_date }}
                  </td>

                  <!-- Hidden until clicked -->
                  <td class="hidden">
                    <transition name="fade">
                      <div class="episode-details" v-show="episode.detailsVisible">
                        <div class="scrim" v-on:click="hideEpisodeDetails(episode)"></div>
                        <div class="overlay">
                          <img v-bind:src="episode.stillUrl" class="episode-still">

                          <header>
                            <h4 class="episode-title">Episode {{ episode.episode_number }}: {{ episode.name }}</h4>
                            <span class="episode-air-date">{{ episode.air_date }}</span>
                          </header>

                          <!-- Only show vote score if there are votes -->
                          <span class="episode-score">
                            <strong>Score:</strong> {{ episode.vote_count ? episode.vote_average + '/10' : 'N/A' }}
                          </span>

                          <p class="episode-overview">{{ episode.overview }}</p>
                        </div>
                      </div>
                    </transition>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { DateTime } from 'luxon';
import Indicator from '@/components/WatchedIndicator.vue';

const contentBaseUrl = process.env.VUE_APP_CONTENT_API_BASE_URL;
const contentKey = process.env.VUE_APP_CONTENT_API_KEY;
const imgBaseUrl = process.env.VUE_APP_IMG_BASE_URL;
const trackingBaseUrl = process.env.VUE_APP_TRACKING_API_BASE_URL;

export default {
  name: 'Show',
  components: {
    Indicator,
  },
  data() {
    return {
      cast: [],
      genres: [],
      id: this.$route.params.id,
      overview: '',
      posterUrl: '',
      score: 0,
      seasons: [],
      title: '',
      website: '',
    };
  },
  mounted() {
    let url = `${contentBaseUrl}/tv/${this.id}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
      .get(url, config)
      .then((response) => {
        this.genres = response.data.genres;
        this.title = response.data.name;
        this.overview = response.data.overview;
        this.score = response.data.vote_average;
        this.seasons = response.data.seasons;
        this.posterUrl = `${imgBaseUrl}w300${response.data.poster_path}`;
        this.website = response.data.homepage;
      });

    url = `${contentBaseUrl}/tv/${this.id}/credits`;

    axios
      .get(url, config)
      .then((response) => {
        this.cast = response.data.cast;

        this.cast.forEach((member) => {
          url = `${contentBaseUrl}/person/${member.id}`;
          axios
            .get(url, config)
            .then((response2) => {
              if (response2.data.profile_path) {
                member.photo = `${imgBaseUrl}w45${response2.data.profile_path}`;
              }
            });
        });
      });
  },
  methods: {
    toggleSeason(seasonNumber) {
      // Find array index
      const seasonIndex = this.seasons.findIndex((season) => season.season_number === seasonNumber);

      if (!this.seasons[seasonIndex].episodes) {
        this.getSeasonDetails(seasonNumber).then(() => {
          this.seasons[seasonIndex].visible = !this.seasons[seasonIndex].visible;

          this.seasons[seasonIndex].episodes.forEach((episode) => {
            this.getWatchedStatus(episode.id).then((status) => {
              episode.watched = status;
            });
          });
        });
      } else {
        this.seasons[seasonIndex].visible = !this.seasons[seasonIndex].visible;
      }
    },
    getSeasonDetails(seasonNumber) {
      const promise = new Promise((resolve) => {
        // Find array index
        const seasonIndex = this.seasons.findIndex((season) => season.season_number === seasonNumber);

        const url = `${contentBaseUrl}/tv/${this.id}/season/${seasonNumber}`;
        const config = {
          params: {
            api_key: contentKey,
          },
        };

        axios
          .get(url, config)
          .then((response) => {
            this.seasons[seasonIndex] = response.data;

            this.seasons[seasonIndex].episodes.forEach((episode) => {
              episode.air_date = DateTime.fromISO(episode.air_date).toLocaleString();
              episode.stillUrl = `${imgBaseUrl}w185${episode.still_path}`;
            });
            resolve();
          });
      });

      return promise;
    },
    getWatchedStatus(id) {
      const promise = new Promise((resolve) => {
        const url = `${trackingBaseUrl}/records/${id}`;

        axios
          .get(url)
          .then((response) => {
            resolve(response.data.watched);
          })
          .catch(() => {
            resolve(false);
          });
      });

      return promise;
    },
    toggleWatchedStatus(episode) {
      const promise = new Promise((resolve) => {
        const url = `${trackingBaseUrl}/records/${episode.id}`;

        if (!episode.watched) {
          const body = {
            mediaType: 'tv',
          };

          axios
            .post(url, body)
            .then(() => {
              episode.watched = true;
              resolve();
            });
        } else {
          axios
            .delete(url)
            .then(() => {
              episode.watched = false;
              resolve();
            });
        }
      });

      return promise;
    },
    showEpisodeDetails(episode) {
      episode.detailsVisible = true;
    },
    hideEpisodeDetails(episode) {
      episode.detailsVisible = false;
    },
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

.seasons {
  ul {
    list-style-type: none;
    padding: 0;

    li {
      background-color: #f9f9f9;
      border-radius: 10px;
      margin-bottom: 10px;
    }
  }
}

.season-name {
  border-radius: 10px;
  margin: 0;
  padding: 1rem 2rem;
  transition: background 0.2s;

  &:hover {
    background-color: #fff;
    cursor: pointer;
  }
}

.season-details {
  box-sizing: border-box;
  max-height: 0;
  overflow: hidden;
  padding: 0 2rem;
  transition: max-height 0.7s, padding 0.7s;

  &.visible {
    max-height: 9999px;
    padding: 2rem;
  }
}

.episodes {
  border-collapse: collapse;
  color: #555;
  font-size: 0.875rem;
  width: 100%;

  tr:hover td {
    background-color: #eee;
    cursor: pointer;
  }

  th {
    border-bottom: 2px solid #ddd;
    font-weight: bold;
    padding: 10px 15px;
  }

  td {
    background-color: transparent;
    border-bottom: 1px solid #ddd;
    padding: 10px 15px;
    transition: background 0.2s;
  }

  .watched-indicator {
    box-sizing: border-box;
    text-align: center;
    width: 30px;
  }

  .episode-number{
    box-sizing: border-box;
    text-align: right;
    width: 30px;
  }

  .air-date {
    text-align: right;
  }

  .hidden {
    width: 0;
  }
}

.episode-details {
  .overlay {
    background-color: #fff;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
    left: 50%;
    padding: 2rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 720px;
    z-index: 2;

    &:hover {
      cursor: default;
    }

    header {
      display: inline-block;
      margin-bottom: 1rem;

      .episode-title {
        display: inline;
        margin: 0 10px 0 0;
      }

      .episode-air-date {
        color: #aaa;
        display: inline;
      }
    }

    .episode-score {
      float: right;
    }

    .episode-still {
      float: left;
      margin-right: 20px;
    }

    *:last-child {
      margin-bottom: 0;
    }
  }

  .scrim {
    background-color: rgba(255, 255, 255, 0.8);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
