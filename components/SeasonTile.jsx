import Link from 'next/link';
import { DateTime } from 'luxon';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function SeasonTile({ title, startDate, poster, showId, seasonNumber }) {
  const startYear = startDate ? DateTime.fromISO(startDate).toLocaleString({year: 'numeric'}) : null;

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = poster ? `${imgBaseUrl}w300${poster}` : null;

  return (
    <Link href={`/shows/${showId}/seasons/${seasonNumber}`}>
      <a className="bg-white block pb-3 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200">
        {posterUrl
        ? <div style={{ backgroundImage: 'url(' + posterUrl + ')', paddingTop: '150%'}} className="bg-center bg-cover bg-no-repeat rounded-t-md w-full h-20"></div>
        : <div style={{ paddingTop: '150%'}} className="bg-gray-100 rounded-t-md w-full h-20 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <h3 className="font-bold text-center mt-3 mb-0">{title}</h3>
        <span className="block text-center text-gray-500 text-sm">{startYear && `(${startYear})` }</span>
      </a>
    </Link>
  );
}

export default SeasonTile;
