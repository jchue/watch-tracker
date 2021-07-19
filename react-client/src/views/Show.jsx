import React from 'react';
import axios from 'axios';
import Genres from '../components/Genres';
import Credits from '../components/Credits';
import Seasons from '../components/Seasons';
import { DesktopComputerIcon, ExternalLinkIcon } from '@heroicons/react/solid';

class Show extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      genres: [],
      overview: '',
      score: 0,
      seasons: [],
      posterUrl: '',
      website: '',
    };
  }

  componentDidMount() {
    this.loadShow(this.props.match.params.showId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.showId !== prevProps.match.params.showId) {
      this.loadShow(this.props.match.params.showId);
    }
  }

  render() {
    return (
      <div>
        {this.state.posterUrl
        ? <img src={this.state.posterUrl} alt={`${this.state.title} Poster`} className="bg-white float-right ml-6 p-2" />
        : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
        }

        <span className="inline-block bg-yellow-200 text-yellow-900 text-xs mb-4 px-2 py-1 rounded-full uppercase font-bold">TV Show</span>
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

        <Credits mediaId={this.props.match.params.showId} mediaType="show" creditType="cast" className="mb-8" />

        <Seasons showId={this.props.match.params.showId} seasons={this.state.seasons} />
      </div>
    );
  }

  loadShow(id) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;

    const url = `${contentBaseUrl}/tv/${id}`;
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
        title: response.data.name,
        overview: response.data.overview,
        score: response.data.vote_average,
        seasons: response.data.seasons,
        posterUrl: response.data.poster_path ? `${imgBaseUrl}w300${response.data.poster_path}` : null,
        website: response.data.homepage,
      });
    });
  }
}

export default Show;
