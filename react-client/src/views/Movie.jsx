import React from 'react';
import axios from 'axios';
import Genres from '../components/Genres';
import Credits from '../components/Credits';
import { DesktopComputerIcon, ExternalLinkIcon } from '@heroicons/react/solid';

class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      genres: [],
      overview: '',
      score: 0,
      posterUrl: '',
      website: '',
    };
  }

  componentDidMount() {
    this.loadMovie(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.loadMovie(this.props.match.params.id);
    }
  }

  render() {
    return (
      <div>
        {this.state.posterUrl
        ? <img src={this.state.posterUrl} alt={`${this.state.title} Poster`} className="bg-white float-right ml-6 p-2" />
        : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <span className="inline-block bg-purple-200 text-purple-900 text-xs mb-4 px-2 py-1 rounded-full uppercase font-bold">Movie</span>
        <h1 className="font-bold text-4xl mb-4">{this.state.title}</h1>

        <section className="text-sm mb-4">
          <Genres genres={this.state.genres} />

          <section>
            <strong>Rating:</strong> {this.state.score}/10
          </section>

          <section>
            <a href={this.state.website} className="font-bold inline-block bg-gray-500 my-2 px-3 py-1.5 rounded text-white text-xs">Website <ExternalLinkIcon className="inline h-5 w-5 -mt-1" /></a>
          </section>
        </section>

        <p>{this.state.overview}</p>

        <Credits mediaId={this.props.match.params.id} mediaType="movie" creditType="cast" />
      </div>
    );
  }

  loadMovie(id) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;

    const url = `${contentBaseUrl}/movie/${id}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        genres: response.data.genres,
        title: response.data.title,
        overview: response.data.overview,
        score: response.data.vote_average,
        posterUrl: response.data.poster_path ? `${imgBaseUrl}w300${response.data.poster_path}` : null,
        website: response.data.homepage,
      });
    });
  }
}

export default Movie;
