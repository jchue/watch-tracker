function Genres({ genres, className }) {
  if (genres) {
    const listItems = genres.map((genre, index) =>
      <li key={genre.id} className="inline-block bg-gray-200 text-gray-500 text-xs mr-1 px-2 py-1 rounded-full uppercase font-bold">{genre.name}
      </li>
    );

    return (
      <ul className={className}>
        {listItems}
      </ul>
    );
  }
}

export default Genres;
