import SeasonTile from './SeasonTile';

function Seasons({ seasons, showId, className }) {
  if (seasons) {
    return(
      <section className={`seasons ${className}`}>
        <h2 className="font-bold text-2xl">Seasons</h2>

        <ul className="grid grid-cols-4">
          {seasons.map((season) =>
            <li key={season.number} className="mr-4 mb-4">
              <SeasonTile title={season.title} showId={showId} seasonNumber={season.number} poster={season.posterPath} startDate={season.startDate} />
            </li>
          )}
        </ul>
      </section>
    );
  }
}

export default Seasons;
