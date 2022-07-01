import React from 'react';
import { DesktopComputerIcon, FilmIcon } from '@heroicons/react/solid';

class MediaTypeBadge extends React.Component {
  render() {
    if (this.props.mediaType === 'show') {
      return (
        <span className={'inline-block text-gray-400 text-xs uppercase font-bold ' + this.props.className}><DesktopComputerIcon className="inline h-5 w-5 -mt-1" /> TV Show</span>
      );
    }

    if (this.props.mediaType === 'movie') {
      return (
        <span className={'inline-block text-gray-400 text-xs uppercase font-bold ' + this.props.className}><FilmIcon className="inline h-5 w-5 -mt-1" /> Movie</span>
      );
    }
  }
}

export default MediaTypeBadge;
