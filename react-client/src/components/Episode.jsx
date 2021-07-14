import React from 'react';
import { DateTime } from 'luxon';
import './Episode.scss';
import Indicator from './Indicator';

class Episode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.toggleEpisodeDetails = this.toggleEpisodeDetails.bind(this);
  }

  toggleEpisodeDetails() {
    this.setState((currentState) => {
      return {
        visible: !currentState.visible,
      };
    });
  }

  render() {
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;
    const airDate = DateTime.fromISO(this.props.airDate).toLocaleString();
    const stillUrl = `${imgBaseUrl}w185${this.props.stillPath}`;

    return (
      <tr className="episode">
        <td className="watched-indicator">
          <Indicator id={this.props.mediaId} />
        </td>
        <td className="episode-number" onClick={this.toggleEpisodeDetails}>
          {this.props.number}
        </td>
        <td className="title" onClick={this.toggleEpisodeDetails}>
          {this.props.name}
        </td>
        <td className="air-date" onClick={this.toggleEpisodeDetails}>
          {airDate}
        </td>

        {/* Hidden until clicked */}
        <td className="hidden">
          <div className="episode-details">
            {this.state.visible &&
              <div>
                <div className="scrim" onClick={this.toggleEpisodeDetails}></div>
                <div className="overlay">
                  <img src={stillUrl} alt={`${this.props.name} Still`} className="episode-still" />

                  <header>
                    <h4 className="episode-title">Episode {this.props.number}: {this.props.name}</h4>
                    <span className="episode-air-date">{airDate}</span>
                  </header>

                  {/* Only show vote score if there are votes */}
                  <span className="episode-score">
                    <strong>Score:</strong> {this.props.voteCount ? this.props.voteAverage + '/10' : 'N/A'}
                  </span>

                  <p className="episode-overview">{this.props.overview}</p>
                </div>
              </div>
            }
          </div>
        </td>
      </tr>
    );
  }
}

export default Episode;
