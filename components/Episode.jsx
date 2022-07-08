import { useState } from 'react';
import { DateTime } from 'luxon';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import Indicator from './Indicator';
import Score from './Score';

function Episode({ mediaId, number, title, date, votes, score, overview, stillPath }) {
  const [visible, setVisible] = useState(false);

  function toggleEpisodeDetails() {
    setVisible(!visible);
  }

  const dateString = date ? DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED) : null;

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const stillUrl = stillPath ? `${imgBaseUrl}original${stillPath}` : null;

  return (
    <>
      {/* Initial table row */}
      <tr className="border-t text-sm border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
        <td className="p-3 pl-8 text-center">
          <Indicator id={mediaId} mediaType="shows" />
        </td>

        <td className={'p-3 text-right transition-all duration-200' + (visible ? ' font-bold text-lg' : '')} onClick={toggleEpisodeDetails}>
          {number}
        </td>

        <td className={'p-3 transition-all duration-200' + (visible ? ' font-bold text-lg' : '')} onClick={toggleEpisodeDetails}>
          {title}
        </td>

        <td className={'p-3 pr-8 text-right transition-all duration-200' + (visible ? ' font-bold text-lg' : '')} onClick={toggleEpisodeDetails}>
          {dateString}
        </td>
      </tr>

      {/* Episode details - hidden until clicked */}
      <tr>
        <td colSpan="4" className="p-0">
          <div className={'overflow-hidden px-8 transition-all duration-200 ' + (visible ? 'max-h-screen pt-4 pb-8' : 'max-h-0 py-0')}>
            {stillUrl
            ? <img src={stillUrl} alt={`${title} Still`} className="float-left mr-4 max-w-sm" />
            : <div className="bg-gray-100 float-left mr-4 w-40 h-40 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
            }

            {/* Only show vote score if there are votes */}
            <span className="block mb-4">
              {votes ? <Score score={score} /> : ''}
            </span>

            <p className="mb-0">{overview}</p>
          </div>
        </td>
      </tr>
    </>
  );
}

export default Episode;
