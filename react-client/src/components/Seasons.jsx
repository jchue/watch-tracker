import React from 'react';
import SeasonTile from './SeasonTile';

class Seasons extends React.Component {
  render() {
    return(
      <section className="seasons">
          <h2 className="font-bold text-2xl">Seasons</h2>

          <ul className="grid grid-cols-4">
            {this.props.seasons.map((season) =>
              <SeasonTile name={season.name} showId={this.props.showId} seasonNumber={season.season_number} poster={season.poster_path} airDate={season.air_date} />
              /*<Season showId={this.props.showId} seasonNumber={season.season_number} name={season.name} overview={season.overview} key={season.id} />*/
            )}
        </ul>
      </section>
    );
  }
}

export default Seasons;
