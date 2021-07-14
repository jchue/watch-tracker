import React from 'react';
import axios from 'axios';
import Person from './Person';
import './Credits.scss';

class Credits extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cast: [],
      crew: [],
    };
  }

  componentDidMount() {
    this.loadCredits(this.props.mediaType, this.props.mediaId);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.mediaType !== prevProps.mediaType) || (this.props.mediaId !== prevProps.mediaId)) {
      this.loadCredits(this.props.mediaType, this.props.mediaId);
    }
  }

  render() {
    /* Display cast by default */
    let members;
    let title = 'Cast';
    if (this.props.creditType === 'crew') {
      members = this.state.crew;
      title = 'Crew';

    } else {
      members = this.state.cast;
    }

    return (
      <section className="credits">
        <h2>{title}</h2>

        <ul>
          {members.map((member, index) =>
            <li key={member.id}>
              <Person id={member.id} />
            </li>
          )}
        </ul>
      </section>
    );
  }

  loadCredits(mediaType, mediaId) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;

    const url = `${contentBaseUrl}/${mediaType === 'show' ? 'tv' : 'movie'}/${mediaId}/credits`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        cast: response.data.cast,
        crew: response.data.crew,
      });
    }); 
  }
}

export default Credits;
