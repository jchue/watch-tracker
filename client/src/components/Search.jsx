import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Search.scss';
import { FilmIcon, DesktopComputerIcon, SearchIcon, UserIcon } from '@heroicons/react/solid';

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
        const contentBaseUrl = process.env.REACT_APP_SERVICE_BASE_URL;

        const url = `${contentBaseUrl}/search/${this.state.query}`;

        axios
        .get(url)
        .then((response) => {
          this.setState({
            shows: response.data.data.shows,
            movies: response.data.data.movies,
            people: response.data.data.people,
            numberOfResults: response.data.data.shows.length + response.data.data.movies.length + response.data.data.people.length,
          });
        });
      }
    });
  }

  render() {
    return (
      <form className="search relative inline">
        <div className="inline-block bg-gray-100 border-0 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
          <SearchIcon className="inline h-5 w-5 -mt-1 mr-2 text-gray-400" />
          <input type="text" value={this.state.query} placeholder="Search" onChange={this.performSearch} className="bg-gray-100 border-0 text-gray-500 focus:ring-0 m-0 p-0 outline-none" />

          {/* Only display if there are results */
          (this.state.numberOfResults > 0) &&
            <ul className="results bg-white p-4 rounded-lg shadow-lg z-10">
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
        </div>
      </form>
    );
  }
}

function SearchResult(props) {
  return (
    <li><Link to={ `/${props.mediaType}/${props.mediaId}` } className="block rounded px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-100 transition-colors duration-200">{props.name || props.title}</Link></li>
  );
}

export default Search;
