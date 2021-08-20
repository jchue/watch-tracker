import React from 'react';
import axios from 'axios';
import Genres from '../components/Genres';
import Credits from '../components/Credits';
import Seasons from '../components/Seasons';
import MediaTypeBadge from '../components/MediaTypeBadge';
import ExternalLink from '../components/ExternalLink';
import Score from '../components/Score';
import { DesktopComputerIcon } from '@heroicons/react/solid';

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
        : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon className="absolute text-gray-200 inset-1/4" /></div>
        }

        <MediaTypeBadge mediaType="show" className="mb-2" />

        <section className="flex items-center mb-3">
          <h1 className="inline-block font-bold mb-0 text-5xl">{this.state.title}</h1>

          <ExternalLink text="Website" url={this.state.website} />
        </section>

        <section className="mb-6">
          <Score score={this.state.score} />
          <Genres className="inline-block ml-4" genres={this.state.genres} />
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

    const url = `${contentBaseUrl}/info/show/${id}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        genres: response.data.data.genres,
        title: response.data.data.name,
        overview: response.data.data.overview,
        score: response.data.data.vote_average,
        seasons: response.data.data.seasons,
        posterUrl: response.data.data.poster_path ? `${imgBaseUrl}w300${response.data.data.poster_path}` : null,
        website: response.data.data.homepage,
      });
    });
  }
}

export default Show;
