import React from 'react';

class Genres extends React.Component {
  render() {
    const listItems = this.props.genres.map((genre, index) =>
        <li key={genre.id} className="inline">{genre.name}
          {/* Display comma after all except last */}
          {index !== (this.props.genres.length - 1) &&
            <span>, </span>
          }
      </li>
    );

    return (
      <section>
        <strong>Genre(s): </strong>
        <ul className="inline">
          {listItems}
        </ul>
      </section>
    );
  }
}

export default Genres;
