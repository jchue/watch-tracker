import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Search.scss';
import { FilmIcon, DesktopComputerIcon, UserIcon } from '@heroicons/react/solid';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      movies: [],
      people: [],
      shows: [],
    };

    this.performSearch = this.performSearch.bind(this);
  }

  performSearch(event) {
    this.setState((state) => ({
      query: event.target.value
    }), () => {
      /* Only if the query is not empty */
      if (this.state.query.length !== 0) {
        const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
        const contentKey = process.env.REACT_APP_CONTENT_API_KEY;

        const url = `${contentBaseUrl}/search/multi`;
        const config = {
          params: {
            api_key: contentKey,
            query: this.state.query,
          },
        };

        axios
        .get(url, config)
        .then((response) => {
          const results = {
            movies: [],
            people: [],
            shows: [],
          };

          response.data.results.forEach((result) => {
            if (result.media_type === 'tv') {
              results.shows.push(result);
            } else if (result.media_type === 'movie') {
              results.movies.push(result);
            } else if (result.media_type === 'person') {
              results.people.push(result);
            }
          });

          this.setState({
            shows: results.shows,
            movies: results.movies,
            people: results.people,
            numberOfResults: results.shows.length + results.movies.length + results.people.length,
          });
        });
      }
    });
  }

  render() {
    return (
      <form className="search relative inline">
        <input type="text" value={this.state.query} placeholder="Search" onChange={this.performSearch} className="bg-gray-100 border-0 rounded-md px-3 py-2 text-gray-500 focus:ring-2 focus:ring-purple-500 outline-none" />

        {/* Only display if there are results */
        (this.state.numberOfResults > 0) &&
          <ul className="results bg-white p-4 rounded-lg shadow-lg">
            <li><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><DesktopComputerIcon className="inline h-5 w-5 mr-1" /> TV Shows</span>
              <ul>
                {this.state.shows.map((show) =>
                  <SearchResult mediaType="shows" mediaId={show.id} name={show.name} key={show.id} />
                )}
              </ul>
            </li>
            <li className="mt-4"><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><FilmIcon className="inline h-5 w-5 mr-2" />Movies</span>
              <ul>
                {this.state.movies.map((movie) =>
                  <SearchResult mediaType="movies" mediaId={movie.id} title={movie.title} key={movie.id} />
                )}
              </ul>
            </li>
            <li className="mt-4"><span className="block uppercase text-gray-400 text-xs font-bold px-3 py-2"><UserIcon className="inline h-5 w-5 mr-2" />People</span>
              <ul>
                {this.state.people.map((person) =>
                  <SearchResult mediaType="people" mediaId={person.id} title={person.name} key={person.id} />
                )}
              </ul>
            </li>
          </ul>
        }
      </form>
    );
  }
}

function SearchResult(props) {
  return (
    <li><Link to={ `/${props.mediaType}/${props.mediaId}` } className="block rounded px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-100">{props.name || props.title}</Link></li>
  );
}

export default Search;
