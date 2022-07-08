import React from 'react';
import SeasonTile from './SeasonTile';

class Seasons extends React.Component {
  render() {
    if (this.props.seasons) {
      return(
        <section className={`seasons ${this.props.className}`}>
          <h2 className="font-bold text-2xl">Seasons</h2>

          <ul className="grid grid-cols-4">
            {this.props.seasons.map((season) =>
              <li key={season.number} className="mr-4 mb-4">
                <SeasonTile title={season.title} showId={this.props.showId} seasonNumber={season.number} poster={season.posterPath} startDate={season.startDate} />
              </li>
            )}
          </ul>
        </section>
      );
    }
  }
}

export default Seasons;
