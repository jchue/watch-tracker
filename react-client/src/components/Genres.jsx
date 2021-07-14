import React from 'react';
import './Genres.scss';

class Genres extends React.Component {
  render() {
    const listItems = this.props.genres.map((genre) =>
      <li key={genre.id}>{genre.name}</li>
    );

    return (
      <section className="genres">
        <strong>Genre(s): </strong>
        <ul>
          {listItems}
        </ul>
      </section>
    );
  }
}

export default Genres;
