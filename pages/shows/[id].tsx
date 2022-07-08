import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import Seasons from '../../components/Seasons';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';

function Show({ show, credits }) {
  const router = useRouter();

  const startYear = show.startDate ? DateTime.fromISO(show.startDate).toLocaleString({year: 'numeric'}) : null;
  const endYear = show.endDate ? DateTime.fromISO(show.endDate).toLocaleString({year: 'numeric'}) : null;
  let yearRangeString;
  if (startYear) {
    if (endYear) {
      if (startYear === endYear) {
        yearRangeString = `(${startYear})`;
      } else {
        yearRangeString = `(${startYear} - ${endYear})`;
      }
    } else {
      yearRangeString = `(${startYear})`;
    }
  }

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = show.posterPath ? `${imgBaseUrl}w300${show.posterPath}` : null;

  return (
    <div>
      {posterUrl
        ? <img src={posterUrl} alt={`${show.title} Poster`} className="bg-white float-right ml-6 p-2" />
        : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon className="absolute text-gray-200 inset-1/4" /></div>
      }

      <header>
        <MediaTypeBadge mediaType="show" className="mb-2" />

        <div className="flex items-center mb-3">
          <h1 className="inline-block font-bold mb-0 text-5xl">
            {show.title} {yearRangeString}
          </h1>

          <ExternalLink text="Website" url={show.website} />
        </div>
      </header>

      <section className="mb-6">
        <Score score={show.score} />
        <Genres className="inline-block ml-4" genres={show.genres} />
      </section>

      <p>{show.overview}</p>

      {(credits.cast.length > 0) &&
        <Credits credits={credits} creditType="cast" className="mb-8" />
      }

      <Seasons showId={router.query.id} seasons={show.seasons} className="clear-right" />
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

    const seasons = data.seasons.map((season) => {
      return {
        number: season.season_number,
        title: season.name,
        posterPath: season.poster_path,
        startDate: season.air_date,
      };
    });

    const show = {
      genres: data.genres,
      website: data.homepage,
      overview: data.overview,
      posterPath: data.poster_path,
      score: data.vote_average,
      seasons,
      title: data.name,
      startDate: data.first_air_date,
      endDate: data.last_air_date,
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
