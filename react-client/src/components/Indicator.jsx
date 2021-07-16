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
    this.getWatchedStatus(this.props.id);
  }

  render() {
    return (
      <input type="checkbox" checked={this.state.watched ? 'checked' : ''} onClick={this.toggleWatchedStatus.bind(this, this.props.id)} className="h-6 w-6 border-2 border-gray-300 rounded cursor-pointer text-purple-800 focus:ring-purple-800 hover:text-purple-500" />
    );
  }

  getWatchedStatus(id) {
    const trackingBaseUrl = process.env.REACT_APP_TRACKING_API_BASE_URL;
    const url = `${trackingBaseUrl}/records/${id}`;

    axios
    .get(url)
    .then((response) => {
      this.setState({
        watched: response.data.watched,
      });
    })
    .catch(() => {
      this.setState({
        watched: false,
      });
    });
  }

  toggleWatchedStatus(id) {
    const trackingBaseUrl = process.env.REACT_APP_TRACKING_API_BASE_URL;
    const url = `${trackingBaseUrl}/records/${id}`;

    if (!this.state.watched) {
      const body = {
        mediaType: 'tv',
      };

      axios
      .post(url, body)
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
