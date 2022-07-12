import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { userId } from '../../lib/auth';
import { DesktopComputerIcon } from '@heroicons/react/solid';
import Genres from '../../components/Genres';
import Credits from '../../components/Credits';
import MediaTypeBadge from '../../components/MediaTypeBadge';
import ExternalLink from '../../components/ExternalLink';
import Score from '../../components/Score';
import Checkbox from '../../components/Checkbox';

function Movie({ movie, credits }) {
  const router = useRouter();

  const [watched, setWatched] = useState(false);

  useEffect(() => {
    // Populate watched status on page load
    async function updateWatchedStatus() {
      const watched = await getWatchedStatus(movie.movieId, 'movies');
      setWatched(watched);
    }
    updateWatchedStatus();
  }, [movie.movieId]);

  async function getWatchedStatus(movieId) {
    const q = query(collection(db, 'movieRecords'), where('movieId', '==', parseInt(movieId)), where('uid', '==', userId));

    const querySnapshot = await getDocs(q);
    const record = await querySnapshot.docs[0];
    
    if (record) {
      return record.data().watched;
    } else {
     return false;
    }
  }

  async function toggleWatchedStatus(movieId) {
    if (!watched) {
      const docRef = await addDoc(collection(db, 'movieRecords'), {
        uid: userId,
        movieId: parseInt(movieId),
        watched: true,
        timestamp: serverTimestamp(),
      });

      setWatched(true);
    } else {
      const q = query(collection(db, 'movieRecords'), where('movieId', '==', parseInt(movieId)), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      const record = await querySnapshot.docs[0];

      await deleteDoc(doc(db, 'movieRecords', record.id));

      setWatched(false);
    }
  }

  const year = movie.date ? DateTime.fromISO(movie.date).toLocaleString({year: 'numeric'}) : null;
  const yearString = year ? `(${year})` : null;

  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const posterUrl = movie.posterPath ? `${imgBaseUrl}w300${movie.posterPath}` : null;

  return (
    <div>
      {posterUrl
        ? <img src={posterUrl} alt={`${movie.title} Poster`} className="bg-white float-right ml-6 p-2" />
        : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
      }

      <header>
        <MediaTypeBadge mediaType="movie" className="mb-2" />

        <div className="flex items-center mb-3">
          <Checkbox id={router.query.id} mediaType="movies" watched={watched} onIndicatorClick={() => toggleWatchedStatus(movie.movieId)} className="mr-2" />

          <h1 className="inline-block font-bold mb-0 text-5xl">
            {movie.title} {yearString}
          </h1>

          <ExternalLink text="Website" url={movie.website} />
        </div>
      </header>

      <section className="mb-6">
        <Score score={movie.score} />
        <Genres className="inline-block ml-4" genres={movie.genres} />
      </section>

      <p>{movie.overview}</p>

      {(credits.cast.length > 0) &&
        <Credits credits={credits} creditType="cast" />
      }
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
      movieId: data.id,
      genres: data.genres,
      website: data.homepage,
      overview: data.overview,
      posterPath: data.poster_path,
      score: data.vote_average,
      title: data.title,
      date: data.release_date,
    };

    return movie;
  }

  async function getMovieCredits(movieId) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/movie/${movieId}/credits?api_key=${key}`;

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
