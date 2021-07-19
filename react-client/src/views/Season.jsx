import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import Episode from '../components/Episode';

class Season extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      overview: '',
      poster: '',
      airDate: '',
      episodes: [],
      showName: '',
      visible: false,
    };

    this.toggleSeason = this.toggleSeason.bind(this);
  }

  componentDidMount() {
    this.loadSeason(this.props.match.params.showId, this.props.match.params.seasonNumber);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.match.params.showId !== prevProps.match.params.showId) || (this.props.match.params.seasonNumber !== prevProps.match.params.seasonNumber)) {
      this.loadSeason(this.props.match.params.showId, this.props.match.params.seasonNumber);
    }
  }

  render() {
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;
    const posterUrl = this.state.poster ? `${imgBaseUrl}w300${this.state.poster}` : null;
    const aired = this.state.airDate ? DateTime.fromISO(this.state.airDate).toFormat('yyyy') : null;

    return (
      <div>
        <section className="flex mb-8">
          {posterUrl
          ? <img src={posterUrl} alt={`${this.state.showName} ${this.state.name} Poster`} className="bg-white mr-6 p-2" />
          : <div className="bg-white mr-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
          }

          <div>
            <span className="inline-block bg-yellow-200 text-yellow-900 text-xs mb-4 px-2 py-1 rounded-full uppercase font-bold">TV Show</span>
            <Link to={`/shows/${this.props.match.params.showId}`} className="block text-gray-500"><ArrowCircleLeftIcon className="inline h-5 w-5 -mt-0.5 mr-1" />{this.state.showName}</Link>
            <h1 className="font-bold text-4xl mb-4" onClick={this.toggleSeason}>{this.state.name} {aired && ({aired}) }</h1>
            <p v-if="season.overview">{this.state.overview}</p>
          </div>
        </section>
        <section className="">
          {/*
            Episode list
          */}
          <h2 className="font-bold text-2xl">Episodes</h2>

          <table className="bg-white rounded-xl shadow w-full">
            <thead className="uppercase rounded-xl text-gray-500 text-xs">
              <tr>
                <th className="bg-gray-50 p-3 pl-8 rounded-tl-xl text-center w-1">Viewed</th>
                <th className="bg-gray-50 p-3 text-right w-1">#</th>
                <th className="bg-gray-50 p-3 text-left">Title</th>
                <th className="bg-gray-50 p-3 pr-8 rounded-tr-xl text-right">Air Date</th>
              </tr>
            </thead>
            <tbody>
              <Episodes episodes={this.state.episodes} />
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  loadSeason(showId, seasonNumber) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;

    const url = `${contentBaseUrl}/tv/${showId}/season/${seasonNumber}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        name: response.data.name,
        overview: response.data.overview,
        poster: response.data.poster_path,
        airDate: response.data.air_date,
        episodes: response.data.episodes,
      });
    });

    this.getShowInfo(showId);
  }

  toggleSeason() {
    this.setState((currentState) => {
      return {
        visible: !currentState.visible,
      };
    });
  }

  getShowInfo(showId) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;

    const url = `${contentBaseUrl}/tv/${showId}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        showName: response.data.name,
      });
    });
  }
}

function Episodes(props) {
  return (
    props.episodes.map((episode) =>
      <Episode number={episode.episode_number} name={episode.name} airDate={episode.air_date} stillPath={episode.still_path} voteCount={episode.vote_count} voteAverage={episode.vote_average} overview={episode.overview} mediaId={episode.id} key={episode.id} />
    )
  );
}

export default Season;
