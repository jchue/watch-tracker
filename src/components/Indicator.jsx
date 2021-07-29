import React from 'react';
import axios from 'axios';

class Indicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      watched: false,
    };

    this.toggleWatchedStatus = this.toggleWatchedStatus.bind(this);
  }

  componentDidMount() {
    this.getWatchedStatus(this.props.id, this.props.mediaType);
  }

  render() {
    return (
      <input type="checkbox" checked={this.state.watched ? 'checked' : ''} onChange={this.toggleWatchedStatus.bind(this, this.props.id, this.props.mediaType)} className="h-6 w-6 border-2 border-gray-300 rounded cursor-pointer text-purple-800 focus:ring-purple-800 hover:text-purple-500" />
    );
  }

  getWatchedStatus(id, mediaTypeParam) {
    const trackingBaseUrl = process.env.REACT_APP_TRACKING_API_BASE_URL;

    let mediaType = 'show';
    if (mediaTypeParam === 'movie') {
      mediaType = 'movie';
    }

    const url = `${trackingBaseUrl}/records/${mediaType}/${id}`;

    axios
    .get(url)
    .then((response) => {
      this.setState({
        watched: response.data.data.watched,
      });
    })
    .catch(() => {
      this.setState({
        watched: false,
      });
    });
  }

  toggleWatchedStatus(id, mediaTypeParam) {
    const trackingBaseUrl = process.env.REACT_APP_TRACKING_API_BASE_URL;

    let mediaType = 'show';
    if (mediaTypeParam === 'movie') {
      mediaType = 'movie';
    }

    const url = `${trackingBaseUrl}/records/${mediaType}/${id}`;

    if (!this.state.watched) {
      axios
      .post(url)
      .then(() => {
        this.setState({
          watched: true,
        });
      });
    } else {
      axios
      .delete(url)
      .then(() => {
        this.setState({
          watched: false,
        });
      });
    }
  }
}

export default Indicator;
