import React from 'react';
import { StarIcon } from '@heroicons/react/solid';

class Score extends React.Component {
  render() {
    return (
      <span><StarIcon className="inline h-5 w-5 -mt-1/2 text-gray-500" /> {this.props.score}</span>
    );
  }
}

export default Score;
