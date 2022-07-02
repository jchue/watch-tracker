import { useRouter } from 'next/router';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function Movie({ movie, credits }) {
  const router = useRouter();

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = movie.posterPath ? `${imgBaseUrl}w300${movie.posterPath}` : null;

  return (
    <div>
      {posterUrl
      ? <img src={posterUrl} alt={`${movie.title} Poster`} className="bg-white float-right ml-6 p-2" />
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

      <Credits credits={credits} creditType="cast" />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  async function getMovie(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/movie/${id}?api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const movie = {
      genres: data.genres,
      website: data.homepage,
      overview: data.overview,
      posterPath: data.poster_path,
      score: data.vote_average,
      title: data.title,
    };

    return movie;
  }

  async function getMovieCredits(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/movie/${id}/credits?api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const credits = {
      cast: data.cast,
      crew: data.crew,
    };

    return credits;
  }

  const movie = await getMovie(params.id);
  const credits = await getMovieCredits(params.id);

  return { props: { movie, credits } };
}

export default Movie;
