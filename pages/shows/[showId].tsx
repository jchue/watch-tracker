import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import Seasons from '../../components/Seasons';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function Show() {
  const [show, setShow] = useState({
    title: '',
    genres: [],
    overview: '',
    score: 0,
    seasons: [],
    posterUrl: '',
    website: '',
  });

  const router = useRouter();

  useEffect(() => { loadShow(router.query.showId) }, [router.query.showId]);

  return (
    <div>
      {show.posterUrl
      ? <img src={show.posterUrl} alt={`${show.title} Poster`} className="bg-white float-right ml-6 p-2" />
      : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon className="absolute text-gray-200 inset-1/4" /></div>
      }

      <MediaTypeBadge mediaType="show" className="mb-2" />

      <section className="flex items-center mb-3">
        <h1 className="inline-block font-bold mb-0 text-5xl">{show.title}</h1>

        <ExternalLink text="Website" url={show.website} />
      </section>

      <section className="mb-6">
        <Score score={show.score} />
        <Genres className="inline-block ml-4" genres={show.genres} />
      </section>

      <p>{show.overview}</p>

      <Credits mediaId={router.query.showId} mediaType="shows" creditType="cast" className="mb-8" />

      <Seasons showId={router.query.showId} seasons={show.seasons} />
    </div>
  );

  async function loadShow(id) {
    const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;

    const url = `/api/info/shows/${id}`;

    const response = await fetch(url);
    const data = await response.json();

    setShow({
      genres: data.genres,
      title: data.title,
      overview: data.overview,
      score: data.vote_average,
      seasons: data.seasons,
      posterUrl: data.poster_path ? `${imgBaseUrl}w300${data.poster_path}` : null,
      website: data.homepage,
    });
  }
}

export default Show;
