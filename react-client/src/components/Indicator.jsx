import React from 'react';
import axios from 'axios';
import './Indicator.scss';

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
      <div className={'indicator' + (this.state.watched ? ' watched' : '')} onClick={this.toggleWatchedStatus}>
        <span>✓</span>
      </div>
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
