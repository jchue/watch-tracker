import React from 'react';
import Link from 'next/link';

class Person extends React.Component {
  render() {
    const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
    const photo = this.props.photo ? `${imgBaseUrl}w185${this.props.photo}` : null;
    const firstNameInitial = this.props.name[0];
    const lastNameInitial = this.props.name.split(' ')[1] ? this.props.name.split(' ')[1][0] : '';

    return (
      <Link href={`/people/${this.props.id}`}>
        <div className="bg-white cursor-pointer rounded-full flex items-center p-2 hover:bg-gray-50 transition-colors duration-200">
          {photo
          ? <div className="bg-center bg-cover bg-no-repeat rounded-full h-12 w-12 mr-3 flex items-center justify-center" style={{ backgroundImage: 'url(' + photo + ')'}}>&nbsp;</div>
          : <div className="bg-gray-100 rounded-full h-12 w-12 mr-3 flex items-center justify-center"><span className="text-xl text-gray-400">{firstNameInitial}{lastNameInitial}</span></div>
          }
          <div className="w-40">
            <span className="block text-xs font-bold">{this.props.name}</span>
            <span className="block text-xs text-gray-500">{this.props.role}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default Person;
