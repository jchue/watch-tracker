import { useEffect, useState } from 'react';

function Indicator({ id, mediaType, className }) {
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    getWatchedStatus(id, mediaType);
  }, [id, mediaType]);

  async function getWatchedStatus(id, mediaTypeParam) {
    let mediaType = 'shows';
    if (mediaTypeParam === 'movies') {
      mediaType = 'movies';
    }

    const url = `/api/records/${mediaType}/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setWatched(data.watched);
    } catch (error) {
      setWatched(false);
    }
  }

  async function toggleWatchedStatus(id, mediaTypeParam) {
    let mediaType = 'shows';
    if (mediaTypeParam === 'movies') {
      mediaType = 'movies';
    }

    const url = `/api/records/${mediaType}/${id}`;

    if (!watched) {
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();

      setWatched(true);
    } else {
      const response = await fetch(url, { method: 'DELETE' });

      setWatched(false);
    }
  }

  return (
    <input type="checkbox" checked={watched ? 'checked' : ''} onChange={() => toggleWatchedStatus(id, mediaType)} className={'h-6 w-6 border-gray-300 rounded cursor-pointer text-indigo-800 focus:ring-indigo-800 hover:text-indigo-500 ' + className} />
  );
}

export default Indicator;
