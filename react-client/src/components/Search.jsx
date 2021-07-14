import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Search.scss';

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
      if (this.state.query.length !== '') {
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
          });
        });
      }
    });
  }

  render() {
    return (
      <form className="search">
        <input type="text" value={this.state.query} onChange={this.performSearch} />
        <ul className="results">
          <li><span className="type">TV Shows</span>
            <ul>
              {this.state.shows.map((show) =>
                <SearchResult mediaType="shows" mediaId={show.id} name={show.name} key={show.id} />
              )}
            </ul>
          </li>
          <li><span className="type">Movies</span>
            <ul>
              {this.state.movies.map((movie) =>
                <SearchResult mediaType="movies" mediaId={movie.id} title={movie.title} key={movie.id} />
              )}
            </ul>
          </li>
          <li><span className="type">People</span>
            <ul>
              {this.state.people.map((person) =>
                <SearchResult mediaType="people" mediaId={person.id} title={person.name} key={person.id} />
              )}
            </ul>
          </li>
        </ul>
      </form>
    );
  }
}

function SearchResult(props) {
  return (
    <li><Link to={ `/${props.mediaType}/${props.mediaId}` }>{props.name || props.title}</Link></li>
  );
}

export default Search;
