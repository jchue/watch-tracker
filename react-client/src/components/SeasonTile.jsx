import React from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { DesktopComputerIcon } from '@heroicons/react/solid';

class SeasonTile extends React.Component {
  render() {
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;
    const posterUrl = this.props.poster ? `${imgBaseUrl}w300${this.props.poster}` : null;
    const aired = this.props.airDate ? DateTime.fromISO(this.props.airDate).toFormat('yyyy') : null;

    return (
      <Link to={`/shows/${this.props.showId}/${this.props.seasonNumber}`} className="bg-white inline-block rounded-md mr-4 mb-4 shadow-md hover:bg-gray-100 transition-colors duration-200">
        {posterUrl
        ? <div style={{ backgroundImage: 'url(' + posterUrl + ')', paddingTop: '150%'}} className="bg-center bg-cover bg-no-repeat rounded-t-md w-full h-20"></div>
        : <div style={{ paddingTop: '150%'}} className="bg-gray-100 rounded-t-md w-full h-20 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <h3 className="font-bold text-center mt-3 mb-0">{this.props.name}</h3>
        <span className="block text-center mb-3 text-gray-500 text-sm">{aired && ({aired}) }</span>
      </Link>
    );
  }
}

export default SeasonTile;
