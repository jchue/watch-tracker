import { DesktopComputerIcon, FilmIcon } from '@heroicons/react/solid';

function MediaTypeBadge({ mediaType, className }) {
  if (mediaType === 'show') {
    return (
      <span className={'text-gray-400 text-xs uppercase font-bold ' + className}><DesktopComputerIcon className="inline h-5 w-5 -mt-1" /> TV Show</span>
    );
  }

  if (mediaType === 'movie') {
    return (
      <span className={'text-gray-400 text-xs uppercase font-bold ' + className}><FilmIcon className="inline h-5 w-5 -mt-1" /> Movie</span>
    );
  }
}

export default MediaTypeBadge;
