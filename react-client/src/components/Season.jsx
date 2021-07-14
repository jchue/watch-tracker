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
      <li className="season">
        <h3 className="season-name" onClick={this.toggleSeason}>{this.props.name}</h3>

        {/* Hidden until clicked */}
        <section className={'season-details' + (this.state.visible ? ' visible' : '')}>
          <p v-if="season.overview">{this.props.overview}</p>

          {/*
            Episode list
          */}
          <h4>Episodes</h4>

          <table className="episodes">
            <thead>
              <tr>
                <th className="watched-indicator">Viewed</th>
                <th className="episode-number">#</th>
                <th className="title">Title</th>
                <th className="air-date">Air Date</th>
                <th className="hidden"></th>
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
