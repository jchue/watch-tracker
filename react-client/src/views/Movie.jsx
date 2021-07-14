import React from 'react';
import axios from 'axios';
import './Movie.scss';
import Genres from '../components/Genres';
import Credits from '../components/Credits';

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
      <div className="movie">
        <img src={this.state.posterUrl} alt={`${this.state.title} Poster`} className="poster" />

        <span className="media-type">Movie</span>
        <h1>{this.state.title}</h1>

        <section className="metadata">
          <Genres genres={this.state.genres} />

          <section className="score">
            <strong>Rating:</strong> {this.state.score}/10
          </section>

          <section className="website">
            <a href={this.state.website}>Website</a>
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
        posterUrl: `${imgBaseUrl}w300${response.data.poster_path}`,
        website: response.data.homepage,
      });
    });
  }
}

export default Movie;
