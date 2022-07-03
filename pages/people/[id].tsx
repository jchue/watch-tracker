import Link from 'next/link';
import { DateTime } from 'luxon';
import { DesktopComputerIcon, FilmIcon } from '@heroicons/react/solid';
import MediaTypeBadge from '../../components/MediaTypeBadge';

function Person({ person, credits }) {
  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const photoUrl = person.photoPath ? `${imgBaseUrl}w300${person.photoPath}` : null;
  const birthday = person.birthday ? DateTime.fromISO(person.birthday).toLocaleString(DateTime.DATE_FULL) : null;

  return (
    <div>
      {photoUrl
      ? <img src={photoUrl} alt={`${person.name} Photo`} className="bg-white float-right ml-6 p-2" />
      : <div className="bg-white float-right ml-6 p-2 w-80 h-80 align-middle relative"><DesktopComputerIcon  className="absolute text-gray-200 inset-1/4" /></div>
      }

      <h1 className="inline-block font-bold mb-6 text-5xl">{person.name}</h1>

      <span className="block mb-6 text-gray-400">Born {birthday}, {person.birthplace}</span>

      <p style={{whiteSpace: "pre-wrap"}}>
        {person.biography}
      </p>

      <section id="credits">
        <h2 className="clear-right font-bold text-2xl">Credits</h2>

        <ul>
          {credits.cast.map((credit) => {
            const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
            const posterUrl = credit.posterPath ? `${imgBaseUrl}w300${credit.posterPath}` : null;
            const year = credit.date ? DateTime.fromISO(credit.date).toFormat('yyyy') : credit.startDate ? `${DateTime.fromISO(credit.startDate).toFormat('yyyy')} - ${DateTime.fromISO(credit.endDate).toFormat('yyyy')}`: null;

            return (
              <li key={credit.id} className="mb-4">
                <Link href={`/${credit.mediaType}s/${credit.id}`}>
                  <a className="bg-white block rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200">
                    {posterUrl
                    ? <div style={{ backgroundImage: 'url(' + posterUrl + ')'}} className="align-middle inline-block bg-center bg-cover bg-no-repeat mr-6 rounded-l-md w-20 aspect-[3/4]"></div>
                    : <div className="align-middle inline-block bg-gray-100 mr-6 rounded-l-md w-20 aspect-[3/4] relative">
                        {(credit.mediaType === 'movie') &&
                          <FilmIcon className="absolute text-gray-200 inset-1/4" />
                        }
                        {(credit.mediaType === 'show') &&
                          <DesktopComputerIcon className="absolute text-gray-200 inset-1/4" />
                        }
                      </div>
                    }

                    <div className="align-middle inline-block">
                    <MediaTypeBadge mediaType={credit.mediaType}  />

                      <h3 className="font-bold -mb-1">{credit.title} {year && `(${year})` }</h3>

                      <span className="text-gray-500">{credit.character}</span>
                      <span className="block mb-1 text-center text-gray-500 text-sm"></span>
                    </div>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  async function getPerson(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    const url = `${baseUrl}/person/${id}?api_key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const person = {
      name: data.name,
      biography: data.biography,
      photoPath: data.profile_path,
      birthplace: data.place_of_birth,
      birthday: data.birthday,
      deathday: data.deathday,
    };

    return person;
  }

  async function getPersonCredits(id) {
    const baseUrl = process.env.BACKEND_BASE_URL;
    const key = process.env.BACKEND_API_KEY;

    let url = `${baseUrl}/person/${id}/combined_credits?api_key=${key}`;

    let response = await fetch(url);
    const data = await response.json();

    const cast = await Promise.all(data.cast.map(async (credit) => {
      const mediaType = credit.media_type === 'movie' ? 'movie' : credit.media_type === 'tv' ? 'show' : null;

      let startDate;
      let endDate;
      if (mediaType === 'show') {
        let url = `${baseUrl}/credit/${credit.credit_id}?api_key=${key}`;

        let response = await fetch(url);
        const creditData = await response.json();

        startDate = creditData.media.seasons[0].air_date;
        endDate = creditData.media.seasons[0].air_date;

        // Find the min/max dates (cannot depend on default order)
        creditData.media.seasons.forEach((season) => {
          const seasonDate =  season.air_date;
          
          if (DateTime.fromISO(seasonDate) < DateTime.fromISO(startDate)) {
            startDate = seasonDate;
          }

          if (DateTime.fromISO(endDate) < DateTime.fromISO(seasonDate)) {
            endDate = seasonDate;
          }
        })
      }

      return {
        id: credit.id,
        title: credit.title || credit.name,
        posterPath: credit.poster_path,
        character: credit.character,
        date: credit.release_date || null,
        startDate: startDate || null,
        endDate: endDate || null,
        mediaType,
      };
    }));

    cast.sort((a, b) => {
      // Sort by most recent date
      const indexA = a.date || a.endDate;
      const indexB = b.date || b.endDate;

      if (indexA === indexB) {
        return 0;
      }

      // If A does not have date, place second
      if (!indexA) {
        return 1;
      }

      // If B does not have date, leave second
      if (!indexB) {
        return -1;
      }

      // Sort in descending order
      return DateTime.fromISO(indexB) - DateTime.fromISO(indexA);
    });

    const credits = {
      cast,
      crew: data.crew,
    };

    return credits;
  }

  const person = await getPerson(params.id);
  const credits = await getPersonCredits(params.id);

  return { props: { person, credits } };
};

export default Person;
