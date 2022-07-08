import React from 'react';
import { DateTime } from 'luxon';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import Indicator from './Indicator';
import Score from './Score';

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
    const dateString = this.props.date ? DateTime.fromISO(this.props.date).toLocaleString(DateTime.DATE_MED) : null;

    const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
    const stillUrl = this.props.stillPath ? `${imgBaseUrl}original${this.props.stillPath}` : null;

    return (
      <React.Fragment>
        {/* Initial table row */}
        <tr className="border-t text-sm border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
          <td className="p-3 pl-8 text-center">
            <Indicator id={this.props.mediaId} mediaType="shows" />
          </td>

          <td className={'p-3 text-right transition-all duration-200' + (this.state.visible ? ' font-bold text-lg' : '')} onClick={this.toggleEpisodeDetails}>
            {this.props.number}
          </td>

          <td className={'p-3 transition-all duration-200' + (this.state.visible ? ' font-bold text-lg' : '')} onClick={this.toggleEpisodeDetails}>
            {this.props.title}
          </td>

          <td className={'p-3 pr-8 text-right transition-all duration-200' + (this.state.visible ? ' font-bold text-lg' : '')} onClick={this.toggleEpisodeDetails}>
            {dateString}
          </td>
        </tr>

        {/* Episode details - hidden until clicked */}
        <tr>
          <td colSpan="4" className="p-0">
            <div className={'overflow-hidden px-8 transition-all duration-200 ' + (this.state.visible ? 'max-h-screen pt-4 pb-8' : 'max-h-0 py-0')}>
              {stillUrl
              ? <img src={stillUrl} alt={`${this.props.title} Still`} className="float-left mr-4 max-w-sm" />
              : <div className="bg-gray-100 float-left mr-4 w-40 h-40 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
              }

              {/* Only show vote score if there are votes */}
              <span className="block mb-4">
                {this.props.votes ? <Score score={this.props.score} /> : ''}
              </span>

              <p className="mb-0">{this.props.overview}</p>
            </div>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default Episode;
