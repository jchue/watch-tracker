import React from 'react';
import axios from 'axios';

class Person extends React.Component {
  render() {
    const imgBaseUrl = process.env.REACT_APP_IMG_BASE_URL;
    const photo = this.props.photo ? `${imgBaseUrl}w185${this.props.photo}` : null;
    const firstNameInitial = this.props.name[0];
    const lastNameInitial = this.props.name.split(' ')[1] ? this.props.name.split(' ')[1][0] : '';
    

    return (
      <div className="bg-white rounded-full flex items-center p-2">
        {photo
        ? <div className="bg-center bg-cover bg-no-repeat rounded-full h-12 w-12 mr-3 flex items-center justify-center" style={{ backgroundImage: 'url(' + photo + ')'}}>&nbsp;</div>
        : <div className="bg-gray-100 rounded-full h-12 w-12 mr-3 flex items-center justify-center"><span className="text-xl text-gray-400">{firstNameInitial}{lastNameInitial}</span></div>
        }
        <div className="w-40">
          <span className="block text-xs font-bold">{this.props.name}</span>
          <span className="block text-xs text-gray-500">{this.props.role}</span>
        </div>
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
