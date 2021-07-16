import React from 'react';
import { DateTime } from 'luxon';
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
      <tr className="border-b text-sm cursor-pointer hover:bg-gray-100 transition duration-200">
        <td className="p-3 text-center">
          <Indicator id={this.props.mediaId} />
        </td>
        <td className="p-3 text-right" onClick={this.toggleEpisodeDetails}>
          {this.props.number}
        </td>
        <td className="p-3" onClick={this.toggleEpisodeDetails}>
          {this.props.name}
        </td>
        <td className="p-3" onClick={this.toggleEpisodeDetails}>
          {airDate}
        </td>

        {/* Hidden until clicked */}
        <td className="w-0">
            {this.state.visible &&
              <div>
                <div className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 fixed top-0 right-0 bottom-0 left-0 cursor-pointer" onClick={this.toggleEpisodeDetails}></div>
                <div className="bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 z-20 cursor-default">
                  <img src={stillUrl} alt={`${this.props.name} Still`} className="float-left mr-4" />

                  <header>
                    <h4 className="font-bold text-lg mb-2">Episode {this.props.number}: {this.props.name}</h4>
                    <span>{airDate}</span>
                  </header>

                  {/* Only show vote score if there are votes */}
                  <span className="block mb-2">
                    <strong>Score:</strong> {this.props.voteCount ? this.props.voteAverage + '/10' : 'N/A'}
                  </span>

                  <p className="mb-0">{this.props.overview}</p>
                </div>
              </div>
            }
        </td>
      </tr>
    );
  }
}

export default Episode;
