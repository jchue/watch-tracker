import { useState } from 'react';
import Link from 'next/link';
import styles from './Search.module.css';
import { FilmIcon, DesktopComputerIcon, SearchIcon, UserIcon } from '@heroicons/react/solid';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    shows: [],
    movies: [],
    people: [],
    numberOfResults: 0,
  });

  async function performSearch(e) {
    setQuery(e.target.value);

    /* Only if the query is not empty */
    if (query.length !== 0) {
      const url = `/api/search/${query}`;

      const response = await fetch(url);
      const data = await response.json();

      setResults({
        shows: data.shows,
        movies: data.movies,
        people: data.people,
        numberOfResults: data.shows.length + data.movies.length + data.people.length,
      });
    }
  }

  return (
    <form className={styles.search + ' relative inline'}>
      <div className="inline-block bg-gray-100 border-0 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
        <SearchIcon className="inline h-5 w-5 -mt-1 mr-2 text-gray-400" />
        <input type="text" value={query} placeholder="Search" onChange={performSearch} className="bg-gray-100 border-0 text-gray-500 focus:ring-0 m-0 p-0 outline-none" />

        {/* Only display if there are results */
        (results.numberOfResults > 0) &&
          <ul className={styles.results + ' bg-white p-4 rounded-lg shadow-lg z-10'}>
            <li><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><DesktopComputerIcon className="inline h-5 w-5 mr-1" /> TV Shows</span>
              <ul>
                {results.shows.map((show) =>
                  <SearchResult mediaType="shows" mediaId={show.id} name={show.name} key={show.id} />
                )}
              </ul>
            </li>
            <li className="mt-4"><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><FilmIcon className="inline h-5 w-5 mr-2" />Movies</span>
              <ul>
                {results.movies.map((movie) =>
                  <SearchResult mediaType="movies" mediaId={movie.id} title={movie.title} key={movie.id} />
                )}
              </ul>
            </li>
            <li className="mt-4"><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><UserIcon className="inline h-5 w-5 mr-2" />People</span>
              <ul>
                {results.people.map((person) =>
                  <SearchResult mediaType="people" mediaId={person.id} title={person.name} key={person.id} />
                )}
              </ul>
            </li>
          </ul>
        }
      </div>
    </form>
  );
}

function SearchResult(props) {
  return (
    <li><Link href={ `/${props.mediaType}/${props.mediaId}` }><a className="block rounded px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-100 transition-colors duration-200">{props.name || props.title}</a></Link></li>
  );
}

export default Search;
