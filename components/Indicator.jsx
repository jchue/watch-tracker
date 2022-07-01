import React from 'react';

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
      <input type="checkbox" checked={this.state.watched ? 'checked' : ''} onChange={this.toggleWatchedStatus.bind(this, this.props.id, this.props.mediaType)} className="h-6 w-6 border-gray-300 rounded cursor-pointer text-indigo-800 focus:ring-indigo-800 hover:text-indigo-500" />
    );
  }

  async getWatchedStatus(id, mediaTypeParam) {
    let mediaType = 'shows';
    if (mediaTypeParam === 'movies') {
      mediaType = 'movies';
    }

    const url = `/api/records/${mediaType}/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      this.setState({
        watched: data.watched,
      });
    } catch (error) {
      this.setState({
        watched: false,
      });
    }
  }

  async toggleWatchedStatus(id, mediaTypeParam) {
    let mediaType = 'shows';
    if (mediaTypeParam === 'movies') {
      mediaType = 'movies';
    }

    const url = `/api/records/${mediaType}/${id}`;

    if (!this.state.watched) {
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();

      this.setState({
        watched: true,
      });
    } else {
      const response = await fetch(url, { method: 'DELETE' });

      this.setState({
        watched: false,
      });
    }
  }
}

export default Indicator;
