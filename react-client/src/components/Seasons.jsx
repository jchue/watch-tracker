import React from 'react';
import Season from './Season';

class Seasons extends React.Component {
  render() {
    return(
      <section className="seasons">
          <h2 className="font-bold text-2xl">Seasons</h2>

          <ul>
            {this.props.seasons.map((season) =>
              <Season showId={this.props.showId} seasonNumber={season.season_number} name={season.name} overview={season.overview} key={season.id} />
            )}
        </ul>
      </section>
    );
  }
}

export default Seasons;
