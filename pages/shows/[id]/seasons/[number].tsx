import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firestore';
import { userId } from '../../../../lib/auth';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import MediaTypeBadge from '../../../../components/MediaTypeBadge';
import Episode from '../../../../components/Episode';
import Checkbox from '../../../../components/Checkbox';

function Season({ season }) {
  const router = useRouter();

  const [seasonWatched, setSeasonWatched] =useState(false);
  const [storedRecords, setStoredRecords] = useState(new Map());

  /**
   * Populate watched status on page load
   */
  useEffect(() => {
    async function updateWatchedStatus() {
      const episodeRecords = await getSeasonWatchedStatus(router.query.id, router.query.number);

      let storedRecordsCache = new Map();
      episodeRecords.forEach((record) => {
        storedRecordsCache.set(record.episodeNumber, record);
      });
      setStoredRecords(new Map(storedRecordsCache));
    }
    updateWatchedStatus();
  }, [season.number]);

  /**
   * Detect when all episodes in season are watched
   */
  useEffect(() => {
    // Only count where watched === true for futureproofing
    const storedRecordsArray = Array.from(storedRecords.values());
    const watchedEpisodes = storedRecordsArray.filter((episode) => episode.watched);

    if (watchedEpisodes.length === season.episodes.length) {
      setSeasonWatched(true);
    } else {
      setSeasonWatched(false);
    }
  }, [storedRecords.size]);

  async function getSeasonWatchedStatus(showId, seasonNumber) {
    const q = query(
      collection(db, 'showRecords'),
      where('showId', '==', parseInt(showId)),
      where('seasonNumber', '==', parseInt(seasonNumber)),
      where('uid', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    
    let episodes = [];
    querySnapshot.forEach((doc) => {
      episodes.push(doc.data());
    });

    return episodes;
  }

  async function toggleEpisodeWatchedStatus(showId, seasonNumber, episodeNumber) {
    if (!storedRecords.has(episodeNumber)) {
      const record = {
        uid: userId,
        showId: parseInt(showId),
        seasonNumber: parseInt(seasonNumber),
        episodeNumber: parseInt(episodeNumber),
        watched: true,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'showRecords'), record);

      const storedRecordsCache = storedRecords;
      storedRecordsCache.set(record.episodeNumber, record);
      setStoredRecords(new Map(storedRecordsCache));
    } else {
      const q = query(
        collection(db, 'showRecords'),
        where('showId', '==', parseInt(showId)),
        where('seasonNumber', '==', parseInt(seasonNumber)),
        where('episodeNumber', '==', parseInt(episodeNumber)),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const record = await querySnapshot.docs[0];

      await deleteDoc(doc(db, 'showRecords', record.id));

      // Remove from watched episodes
      let storedRecordsCache = storedRecords;
      storedRecordsCache.delete(parseInt(episodeNumber));
      setStoredRecords(new Map(storedRecordsCache));
    }
  }

  async function toggleSeasonWatchedStatus(showId, seasonNumber) {
    if (seasonWatched) {
      const q = query(
        collection(db, 'showRecords'),
        where('showId', '==', parseInt(showId)),
        where('seasonNumber', '==', parseInt(seasonNumber)),
        where('uid', '==', userId)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (record) => {
        await deleteDoc(doc(db, 'showRecords', record.id));
      });

      const storedRecordsCache = storedRecords;
      storedRecordsCache.clear();
      setStoredRecords(new Map(storedRecordsCache));
    } else {
      let storedRecordsCache = new Map();

      for (let i = 0; i < season.episodes.length; i++) {
        const record = {
          uid: userId,
          showId: parseInt(showId),
          seasonNumber: parseInt(seasonNumber),
          episodeNumber: parseInt(season.episodes[i].number),
          watched: true,
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'showRecords'), record);

        storedRecordsCache.set(record.episodeNumber, record);
      };

      setStoredRecords(new Map(storedRecordsCache));
    }
  }

  const startYear = season.startDate ? DateTime.fromISO(season.startDate).toLocaleString({year: 'numeric'}) : null;
  const startYearString = startYear ? `(${startYear})` : null;

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = season.posterPath ? `${imgBaseUrl}w300${season.posterPath}` : null;

  return (
    <div>
      <section className="flex mb-8">
        {posterUrl
          ? <img src={posterUrl} alt={`${season.showTitle} ${season.title} Poster`} className="bg-white mr-6 p-2" />
          : <div className="bg-white mr-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <div>
          <MediaTypeBadge mediaType="show" className="block mb-2" />

          <Checkbox id={router.query.id} mediaType="shows" watched={seasonWatched} onIndicatorClick={() => toggleSeasonWatchedStatus(router.query.id, router.query.number)} className="align-middle inline-block mr-2" />

          <h1 className="align-middle inline-block font-bold text-5xl mb-2">{season.title} {startYearString}</h1>

          <Link href={`/shows/${router.query.id}`}>
            <a className="block mb-4 text-xl text-indigo-600 hover:text-indigo-500">
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
          {season.episodes.map((episode) =>
            <Episode key={episode.number} number={episode.number} title={episode.title} date={episode.date} stillPath={episode.stillPath} votes={episode.votes} score={episode.score} overview={episode.overview} mediaId={episode.episodeId} watched={storedRecords.has(episode.number)} onStatusChange={() => toggleEpisodeWatchedStatus(router.query.id, router.query.number, episode.number)} />
          )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const key = process.env.BACKEND_API_KEY;

  let url = `${baseUrl}/tv/${params.id}/season/${params.number}?api_key=${key}`;

  let response = await fetch(url);
  let data = await response.json();

  const episodes = data.episodes.map((episode) => {
    return {
      episodeId: episode.id,
      number: episode.episode_number,
      title: episode.name,
      date: episode.air_date,
      stillPath: episode.still_path,
      votes: episode.vote_count,
      score: episode.vote_average,
      overview: episode.overview,
    };
  });

  let season = {
    number: data.season_number,
    startDate: data.air_date,
    episodes,
    overview: data.overview,
    posterPath: data.poster_path,
    title: data.name,
  };

  /**
   * Get show title
   */

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
