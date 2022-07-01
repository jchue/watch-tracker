import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import MediaTypeBadge from '../../../components/MediaTypeBadge';
import Episode from '../../../components/Episode';

function Season() {
  const [season, setSeason] = useState({
    name: '',
    overview: '',
    poster: '',
    airDate: '',
    episodes: [],
    posterUrl: '',
    aired: null,
    visible: false,
  });

  const [show, setShow] = useState({
    name: '',
  });

  const router = useRouter();

  useEffect(() => { loadSeason(router.query.showId, router.query.seasonNumber) }, [router.query.showId, router.query.seasonNumber]);

  async function loadSeason(showId, seasonNumber) {
    const url = `/api/info/shows/${showId}/season/${seasonNumber}`;

    const response = await fetch(url);
    const data = await response.json();

    await setSeason({
      name: data.name,
      overview: data.overview,
      poster: data.poster_path,
      airDate: data.air_date,
      episodes: data.episodes,
      posterUrl: data.poster_path ? `${imgBaseUrl}w300${data.poster_path}` : null,
      aired: data.air_date ? DateTime.fromISO(data.air_date).toFormat('yyyy') : null,
    });

    getShowInfo(showId);
  }

  function toggleSeason() {
    this.setState((currentState) => {
      return {
        visible: !currentState.visible,
      };
    });
  }

  async function getShowInfo(showId) {
    const url = `/api/info/shows/${showId}`;

    const response = await fetch(url);
    const data = await response.json();

    setShow({
      name: data.title,
    });
  }

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;

  return (
    <div>
      <section className="flex mb-8">
        {season.posterUrl
        ? <img src={season.posterUrl} alt={`${show.name} ${season.name} Poster`} className="bg-white mr-6 p-2" />
        : <div className="bg-white mr-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <div>
          <MediaTypeBadge mediaType="show" className="mb-2" />

          <h1 className="font-bold text-5xl mb-2" onClick={toggleSeason}>{season.name} {season.aired && `(${season.aired})` }</h1>

          <Link href={`/shows/${router.query.showId}`}>
            <a className="block mb-4 text-xl text-indigo-500">
              <ArrowCircleLeftIcon className="inline h-5 w-5 -mt-0.5 mr-1" />{show.name}
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

export default Season;
