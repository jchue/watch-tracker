import { useEffect, useState } from 'react';
import Person from './Person';

function Credits({ className, credits, creditType, mediaType, mediaId }) {
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
}

export default Credits;
