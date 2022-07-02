import { useRouter } from 'next/router';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import MediaTypeBadge from '../../../../components/MediaTypeBadge';
import Episode from '../../../../components/Episode';

function Season({ season }) {
  const router = useRouter();

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = season.posterPath ? `${imgBaseUrl}w300${season.posterPath}` : null;
  const aired = season.airDate ? DateTime.fromISO(season.airDate).toFormat('yyyy') : null;

  return (
    <div>
      <section className="flex mb-8">
        {posterUrl
        ? <img src={posterUrl} alt={`${season.showTitle} ${season.title} Poster`} className="bg-white mr-6 p-2" />
        : <div className="bg-white mr-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <div>
          <MediaTypeBadge mediaType="show" className="mb-2" />

          <h1 className="font-bold text-5xl mb-2">{season.title} {aired && `(${aired})` }</h1>

          <Link href={`/shows/${router.query.id}`}>
            <a className="block mb-4 text-xl text-indigo-500">
              <ArrowCircleLeftIcon className="inline h-5 w-5 -mt-0.5 mr-1" />{season.showTitle}
            </a>
          </Link>

          <p v-if="season.overview">{season.overview}</p>
        </div>
      </section>
      <section className="">
        {/*
          Episode list
        */}
        <h2 className="font-bold text-2xl">Episodes</h2>

        <table className="bg-white rounded-xl shadow w-full">
          <thead className="uppercase rounded-xl text-gray-500 text-xs">
            <tr>
              <th className="bg-gray-50 p-3 pl-8 rounded-tl-xl text-center w-1">Viewed</th>
              <th className="bg-gray-50 p-3 text-right w-1">#</th>
              <th className="bg-gray-50 p-3 text-left">Title</th>
              <th className="bg-gray-50 p-3 pr-8 rounded-tr-xl text-right">Air Date</th>
            </tr>
          </thead>
          <tbody>
            <Episodes episodes={season.episodes} />
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Episodes(props) {
  if (props.episodes) {
    return (
      props.episodes.map((episode) =>
        <Episode key={episode.id} number={episode.episode_number} name={episode.name} airDate={episode.air_date} stillPath={episode.still_path} voteCount={episode.vote_count} voteAverage={episode.vote_average} overview={episode.overview} mediaId={episode.id} />
      )
    );
  }
}

export async function getServerSideProps({ params }) {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  let url = `${baseUrl}/tv/${params.id}/season/${params.number}?api_key=${key}`;

  let response = await fetch(url);
  let data = await response.json();

  let season = {
    airDate: data.air_date,
    episodes: data.episodes,
    overview: data.overview,
    posterPath: data.poster_path,
    title: data.name,
  };

  url = `${baseUrl}/tv/${params.id}?api_key=${key}`;

  response = await fetch(url);
  data = await response.json();

  season = {
    ...season,
    showTitle: data.name,
  };

  return { props: { season } };
};

export default Season;
