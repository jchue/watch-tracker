import Link from 'next/link';

function Person({ id, photo, name, role }) {
  const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_BASE_URL;
  const photoUrl = photo ? `${imgBaseUrl}w185${photo}` : null;
  const firstNameInitial = name[0];
  const lastNameInitial = name.split(' ')[1] ? name.split(' ')[1][0] : '';

  return (
    <Link href={`/people/${id}`}>
      <div className="bg-white cursor-pointer rounded-full flex items-center p-2 hover:bg-gray-50 transition-colors duration-200">
        {photo
        ? <div className="bg-center bg-cover bg-no-repeat rounded-full h-12 w-12 mr-3 flex items-center justify-center" style={{ backgroundImage: 'url(' + photoUrl + ')'}}>&nbsp;</div>
        : <div className="bg-gray-100 rounded-full h-12 w-12 mr-3 flex items-center justify-center"><span className="text-xl text-gray-400">{firstNameInitial}{lastNameInitial}</span></div>
        }
        <div className="w-40">
          <span className="block text-xs font-bold">{name}</span>
          <span className="block text-xs text-gray-500">{role}</span>
        </div>
      </div>
    </Link>
  );
}

export default Person;
