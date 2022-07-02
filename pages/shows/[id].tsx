import { useRouter } from 'next/router';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import Seasons from '../../components/Seasons';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';
import { DesktopComputerIcon } from '@heroicons/react/solid';

function Show({ show, credits }) {
  const router = useRouter();

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = show.posterPath ? `${imgBaseUrl}w300${show.posterPath}` : null;

  return (
    <div>
      {posterUrl
      ? <img src={posterUrl} alt={`${show.title} Poster`} className="bg-white float-right ml-6 p-2" />
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

      <Credits credits={credits} creditType="cast" className="mb-8" />

      <Seasons showId={router.query.id} seasons={show.seasons} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  async function getShow(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/tv/${id}?api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const show = {
      genres: data.genres,
      website: data.homepage,
      overview: data.overview,
      posterPath: data.poster_path,
      score: data.vote_average,
      seasons: data.seasons,
      title: data.name,
    };

    return show;
  }

  async function getShowCredits(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/tv/${id}/credits?api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const credits = {
      cast: data.cast,
      crew: data.crew,
    };

    return credits;
  }

  const show = await getShow(params.id);
  const credits = await getShowCredits(params.id);

  return { props: { show, credits } };
};

export default Show;
