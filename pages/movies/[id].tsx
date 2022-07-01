import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function Movie() {
  const [movie, setMovie] = useState({
    title: '',
    genres: [],
    overview: '',
    score: 0,
    posterUrl: '',
    website: '',
  });

  const router = useRouter();

  useEffect(() => { loadMovie(router.query.id) }, [router.query.id]);

  async function loadMovie(id) {
    const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;

    const url = `/api/info/movies/${id}`;

    const response = await fetch(url);
    const data = await response.json();

    setMovie({
      genres: data.genres,
      title: data.title,
      overview: data.overview,
      score: data.vote_average,
      posterUrl: data.poster_path ? `${imgBaseUrl}w300${data.poster_path}` : null,
      website: data.homepage,
    });
  }

  return (
    <div>
      {movie.posterUrl
      ? <img src={movie.posterUrl} alt={`${movie.title} Poster`} className="bg-white float-right ml-6 p-2" />
      : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
      }

      <MediaTypeBadge mediaType="movie" className="mb-2" />

      <section className="flex items-center mb-3">
        <h1 className="inline-block font-bold mb-0 text-5xl">{movie.title}</h1>

        <ExternalLink text="Website" url={movie.website} />
      </section>

      <section className="mb-6">
        <Score score={movie.score} />
        <Genres className="inline-block ml-4" genres={movie.genres} />
      </section>

      <p>{movie.overview}</p>

      <Credits mediaId={router.query.id} mediaType="movies" creditType="cast" />
    </div>
  );
}

export default Movie;
