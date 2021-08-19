import React from 'react';

class Genres extends React.Component {
  render() {
    const listItems = this.props.genres.map((genre, index) =>
      <li key={genre.id} className="inline-block bg-gray-200 text-gray-500 text-xs mr-1 px-2 py-1 rounded-full uppercase font-bold">{genre.name}
      </li>
    );

    return (
      <ul className={this.props.className}>
        {listItems}
      </ul>
    );
  }
}

export default Genres;
