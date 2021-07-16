import React from 'react';
import axios from 'axios';
import Episode from './Episode';
import './Season.scss';

class Season extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      episodes: [],
      visible: false,
    };

    this.toggleSeason = this.toggleSeason.bind(this);
  }

  componentDidMount() {
    this.loadSeason(this.props.showId, this.props.seasonNumber);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.showId !== prevProps.showId) || (this.props.seasonNumber !== prevProps.seasonNumber)) {
      this.loadSeason(this.props.showId, this.props.seasonNumber);
    }
  }

  render() {
    return (
      <li className="rounded-lg bg-white mb-2">
        <h3 className="text-lg m-0 px-6 py-4 cursor-pointer font-semibold" onClick={this.toggleSeason}>{this.props.name}</h3>

        {/* Hidden until clicked */}
        <section className={'season-details border-t border-gray-200 px-6' + (this.state.visible ? ' visible' : '')}>
          <p v-if="season.overview">{this.props.overview}</p>

          {/*
            Episode list
          */}
          <h4 className="font-bold">Episodes</h4>

          <table className="w-full">
            <thead className="uppercase text-gray-500 text-xs">
              <tr className="bg-gray-100 border-t border-b">
                <th className="p-2 text-center w-1">Viewed</th>
                <th className="p-2 text-right w-1">#</th>
                <th className="p-2">Title</th>
                <th className="p-2">Air Date</th>
                <th className="w-0"></th>
              </tr>
            </thead>
            <tbody>
              <Episodes episodes={this.state.episodes} />
            </tbody>
          </table>
        </section>
      </li>
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
        episodes: response.data.episodes,
      });
    });
  }

  toggleSeason() {
    this.setState((currentState) => {
      return {
        visible: !currentState.visible,
      };
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
