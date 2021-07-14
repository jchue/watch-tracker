import React from 'react';
import Season from './Season';
import './Seasons.scss';

class Seasons extends React.Component {
  render() {
    return(
      <section className="seasons">
          <h2>Seasons</h2>

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
