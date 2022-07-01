import { useEffect, useState } from 'react';
import Person from './Person';

function Credits({ className, creditType, mediaType, mediaId }) {
  const [credits, setCredits] = useState({
    cast: [],
    crew: [],
  });

  useEffect(() => { loadCredits(mediaType, mediaId) }, [mediaType, mediaId]);

  /* Display cast by default */
  let members;
  let title = 'Cast';
  if (creditType === 'crew') {
    members = credits.crew;
    title = 'Crew';

  } else {
    members = credits.cast;
  }

  if (members) {
    return (
      <section className={className}>
        <h2 className="font-bold text-2xl">{title}</h2>

        <ul>
          {members.map((member, index) =>
            <li key={member.id} className="inline-block m-1">
              <Person name={member.name} photo={member.profile_path} role={member.character || member.job} />
            </li>
          )}
        </ul>
      </section>
    );
  }

  async function loadCredits(mediaType, mediaId) {
    const url = `/api/info/${mediaType}/${mediaId}/credits`;

    const response = await fetch(url);
    const data = await response.json();

    setCredits({
      cast: data.cast,
      crew: data.crew,
    });
  }
}

export default Credits;
