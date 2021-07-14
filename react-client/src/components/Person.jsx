import React from 'react';
import axios from 'axios';
import './Person.scss';

class Person extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      photo: '',
    };
  }

  componentDidMount() {
    this.loadPerson(this.props.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.loadPerson(this.props.id);
    }
  }

  render() {
    return (
      <div className="person">
        <div className="photo" style={{ backgroundImage: this.state.photo ? `url(${this.state.photo})` : 'none' }}></div>
        {this.state.name}
      </div>
    );
  }

  loadPerson(id) {
    const contentBaseUrl = process.env.REACT_APP_CONTENT_API_BASE_URL;
    const contentKey = process.env.REACT_APP_CONTENT_API_KEY;
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;

    const url = `${contentBaseUrl}/person/${id}`;
    const config = {
      params: {
        api_key: contentKey,
      },
    };

    axios
    .get(url, config)
    .then((response) => {
      this.setState({
        name: response.data.name,
        photo: response.data.profile_path ? `${imgBaseUrl}w45${response.data.profile_path}` : null,
      });
    });
  }
}

export default Person;
